import type { UserDataChunkData, UserDataChunkItemData, UserDataChunkDataEncoded, UserDataTypeOperation, UserDataCollection, UserDataOperation } from '@/types'
import type { Storage } from 'web-browser-storage'

import { encodeData, decodeData } from './encodeDecode.js'

import {
	getUnderlyingCollectionType,
	isCollectionTypeSplitByChannelAndThread,
	isCollectionTypeSplitByChannel,
	getCollectionChunkKey,
	getListItemCompareFunction,
	getListItemMatchFunction
} from './collection.utility.js'

import validateOperationArguments from './collection.validateOperationArguments.js'

interface Parameters {
	collection: UserDataCollection;
	operations: Partial<Record<UserDataOperation, UserDataTypeOperation>>;
	prefix: string;
	storage: Storage;
	log: (...args: any[]) => void;
	getCollectionDataValidationFunction: (collection: UserDataCollection) => (value: UserDataChunkData) => void;
	getCollectionDataItemValidationFunction: (collection: UserDataCollection) => (value: UserDataChunkItemData) => void;
}

export default function createMethod(op: UserDataOperation, {
	collection,
	operations,
	prefix,
	storage,
	log,
	getCollectionDataValidationFunction,
	getCollectionDataItemValidationFunction
}: Parameters) {
	let {
		match,
		compare
	} = collection

	if (getUnderlyingCollectionType(collection.type) === 'list') {
		if (!match) {
			match = getListItemMatchFunction(collection.type)
		}
		if (!compare) {
			compare = getListItemCompareFunction(collection.type)
		}
		if (!match) {
			throw new Error(`Collection "${collection.name}" must define an \`match\` function`)
		}
		// `compare()` function is optional and is used for sorting an updated list.
		// if (!compare) {
		// 	throw new Error(`Collection "${collection.name}" must define a \`compare\` function`)
		// }
	}

	if (getUnderlyingCollectionType(collection.type) !== 'list') {
		if (op === 'mergeWith' && !collection.merge) {
			throw new Error(`No \`merge\` function is defined for collection "${collection.name}"`)
		}
	}

	return (...args: any[]) => {
		const metadata = getMetadata(args, collection, op)
		const key = prefix + getCollectionChunkKey(collection, metadata)

		log(key, op)

		const operation = (op: UserDataOperation) => {
			if (!operations[op]) {
				throw new Error(`No "${op}" operation has been defined for collection "${collection.name}"`)
			}

			const { value } = validateOperationArguments(args, { op, collection })

			// Validate the argument of a write operation.
			//
			// "Remove from" operation argument is not validated
			// because it's doesn't necessarily contain all the properties:
			// it might contain just the ones that're used in `match()` comparison.
			//
			try {
				if (op === 'addTo' || op === 'setIn') {
					getCollectionDataItemValidationFunction(collection)(value)
				} else if (op === 'set') {
					getCollectionDataValidationFunction(collection)(value)
				}
			} catch (error) {
				console.error(`Error while validating the argument of "${op}" operation in "${collection.name}" User Data collection.`)
				throw error
			}

			let chunkData = storage.get(key)

			// If chunk data doesn't exist for this `key`, set it to `undefined`.
			// This way, collection type methods can use `function(argument = defaultValue)`
			// notation for the chunk data argument to set it to some default initial value.
			if (chunkData === null) {
				chunkData = undefined
			}

			return operations[op].apply(this, [
				{
					// "Decodes" data after it has been read from disk.
					decode: (data: UserDataChunkDataEncoded) => decodeData(data, collection),

					// "Encodes" data before storing it on disk.
					encode: (data: UserDataChunkData) => encodeData(data, collection),

					// `compare()` is used in "list" collections to sort them
					// after adding an item via `addTo` operation.
					compare,

					// `match()` is used in "list" collections in operations like
					// `getFrom` or `mergeWith`.
					match,

					// List collections can define a `merge(item1, item2)` function
					// which would then be used in cases when two lists are merged
					// and both lists have the same item, in which case the merged list
					// will have a "merged" item.
					// ("same items" means "sameness" in terms of `collection.match()`).
					merge: collection.merge,

					// The maximum number of items in a list collection.
					// Lists will get trimmed if the limit is exceeded.
					maxCount: collection.maxCount,

					// (optional) Custom `maxCount` list length trimming function.
					trim: collection.trim
				},
				chunkData,
				...args
			])
		}

		const result = operation(op)

		// const read = (defaultValue) => {
		// 	const result = storage.get(key)
		// 	if (result === undefined) {
		// 		return defaultValue
		// 	}
		// 	return result
		// }

		const write = (value: any) => storage.set(key, value)
		const remove = () => storage.delete(key)

		switch (op) {
			case 'get':
				// If the item is not found in collection data,
				// `get` operation returns `undefined`.
				if (result === undefined) {
					return
				}
				// Validate the result.
				try {
					getCollectionDataValidationFunction(collection)(result)
				} catch (error) {
					console.error(`Error while validating the result of "${op}" operation of "${collection.name}" collection in UserData.`)
					console.error(error)
					// For some reason, the `error` message disappears when logged by the line above.
					// To work around that, also output a stringified version of it.
					console.error(JSON.stringify(error, null, 2))
					console.log(result)
					// For some reason, the `result` value "disappears" when logged by the line above.
					// To work around that, also output a stringified version of it.
					console.log(JSON.stringify(result, null, 2))
				}
				return result

			case 'getFrom':
				// If the item is not found in collection data,
				// `getFrom` operation returns `undefined`.
				if (result === undefined) {
					return
				}
				// Validate the result.
				try {
					getCollectionDataItemValidationFunction(collection)(result)
				} catch (error) {
					console.error(`Error while validating the result of "${op}" operation of "${collection.name}" collection in UserData.`)
					console.error(error)
					// For some reason, the `error` message disappears when logged by the line above.
					// To work around that, also output a stringified version of it.
					console.error(JSON.stringify(error, null, 2))
					console.log(result)
					// For some reason, the `result` value "disappears" when logged by the line above.
					// To work around that, also output a stringified version of it.
					console.log(JSON.stringify(result, null, 2))
				}
				return result

			case 'addTo':
			case 'setIn':
				// `addTo` operation returns `undefined` when the item already exists in "list" collection data.
				// `setIn` operation returns `undefined` when the item doesn't exist in "list" collection data.
				if (result === undefined) {
					return
				}
				// Update collection data.
				write(result)
				return

			case 'set':
				// Update collection data.
				write(result)
				return

			case 'remove':
				// Remove collection data entirely.
				remove()
				return

			case 'removeFrom':
				// If the collection data didn't previously exist,
				// `removeFrom` operation returns `undefined`.
				if (result === undefined) {
					// The collection has no data anyway.
				}
				// `removeFrom` operation returns `null` when the resulting
				// collection data is empty after the removal.
				else if (result === null) {
					// Remove collection data entirely.
					remove()
				}
				else {
					// Update collection data.
					write(result)
				}
				return

			case 'mergeWith':
				// Update the merged collection data.
				write(result)
				return

			default:
				throw new Error(`Unsupported operation "${op}" for collection "${collection.name}"`)
		}
	}
}

function getMetadata(args: any[], collection: UserDataCollection, op: UserDataOperation) {
	// Get channel ID and thread ID.
	let channelId
	let threadId
	if (isCollectionTypeSplitByChannelAndThread(collection.type)) {
		channelId = args.shift()
		threadId = args.shift()
		if (!channelId) {
			throw new Error(`[UserData] "channelId" argument is required for "${op}" operation for collection "${collection.name}"`)
		}
		if (!threadId) {
			throw new Error(`[UserData] "threadId" argument is required for "${op}" operation for collection "${collection.name}"`)
		}
	} else if (isCollectionTypeSplitByChannel(collection.type)) {
		channelId = args.shift()
		if (!channelId) {
			throw new Error(`[UserData] "channelId" argument is required for "${op}" operation for collection "${collection.name}"`)
		}
	}
	return {
		channelId,
		threadId
	}
}

// if (op === 'mergeWith' && method) {
// 	// `merge` methods shouldn't call `operation(operationName)` operation
// 	// because it's a special case when `archived` should be `false`.
// 	// Calling `operation(operationName)` inside a `method` returns the
// 	// operation result which is then used to possibly overwrite the data
// 	// in the store under the certain `key` which depends on `archived` flag,
// 	// So it would require tracking whether the result returned from `method`
// 	// is received from a "merge" `operation` or not and there is no sane way
// 	// of doing that.
// 	throw new Error('"merge" methods don\'t support a custom function argument')
// }

// let result
// if (createMethod_) {
// 	// Supports a custom operation that uses the basic operations.
// 	result = createMethod_({
// 		args,
// 		addTo: () => operation('addTo'),
// 		getFrom: () => operation('getFrom'),
// 		set: operations.set && (() => operation('set')),
// 		remove: () => operation('remove'),
// 		removeFrom: () => operation('removeFrom')
// 	})
// } else {
// 	result = operation(op)
// }