import { getOperations } from './collection.operations.js'
import createMethod from './UserData.createCollectionDataAccessMethod.js'
import getMethodName from './getMethodName.js'

export default function createDataAccessMethods({
	collections,
	storage,
	prefix,
	log,
	getCollectionDataValidationFunction,
	getCollectionDataItemValidationFunction
}) {
	for (const collectionName of Object.keys(collections)) {
		const collection = collections[collectionName]
		const operations = getOperations(collection.type)

		// Every collection should support a `mergeWith` operation
		// that is used in `UserData.js` in `merge()` function.
		if (!operations.mergeWith) {
			throw new Error(`Collection "${collectionName}" should support a "mergeWith" operation`)
		}

		const addMethod = (op) => {
			const method = createMethod(op, {
				operations,
				collection,
				storage,
				prefix,
				log,
				getCollectionDataValidationFunction,
				getCollectionDataItemValidationFunction
			})
			this[getMethodName(op, collection.name)] = (...args) => {
				this._onDataAccess()
				return method.apply(null, args)
			}
		}

		for (const operation of Object.keys(operations)) {
			addMethod(operation)
		}
	}
}

// const callMethod = (collectionName, operation, args) => {
// 	return this[getMethodName(operation, collectionName)].apply(this, args)
// }

// if (operations.addTo) {
// 	addMethod('addTo', ({ args, addTo }) => {
// 		// Also add to "index" collection.
// 		if (collection.index) {
// 			const item = args[args.length - 1]
// 			if (!collection.getIndexCollectionMethodArgs) {
// 				throw new Error(`Collection "${collection.name}" defines an "index" collection but doesn't provide a "getIndexCollectionMethodArgs()" function"`)
// 			}
// 			callMethod(collection.index, 'addTo', collection.getIndexCollectionMethodArgs(item))
// 		}
// 		// `add` operation is defined on all collections.
// 		return add()
// 	})
// }

// addMethod('set', ({ args, set }) => {
// 	if (!set) {
// 		throw new Error(`No "set" operation has been defined for collection "${collection.name}"`)
// 	}
// 	return set()
// 	// Doesn't update the related "index" collection.
// 	// For example, if something like "subscribedThreads" would be "set"
// 	// "from scratch", then "subscribedThreadsIndex" index collection wouldn't be updated,
// 	// and would have to be re-initialized manually.
// })

// addMethod('removeFrom', ({ get, removeFrom }) => {
// 	// `item` is used in `getIndexCollectionMethodArgs()`.
// 	const item = get()
// 	if (item) {
// 		// const result = operation('removeFrom')
// 		// if (result !== undefined) {
// 			// Also remove from the related "index" collection.
// 			if (collection.index) {
// 				if (!collection.getIndexCollectionMethodArgs) {
// 					throw new Error(`Collection "${collection.name}" defines an "index" collection but doesn't provide a "getIndexCollectionMethodArgs()" function"`)
// 				}
// 				callMethod(collection.index, 'removeFrom', collection.getIndexCollectionMethodArgs(item))
// 			}
// 		// }
// 		// return result
// 		// `remove` operation is defined on all collections.
// 		return removeFrom()
// 	} else {
// 		// If the item is not found then don't throw an error
// 		// because the result is the same: the item is not present in the collection data.
// 		// console.error(`Item "${JSON.stringify(args)}" not found in "${collection.index}"`)
// 	}
// })