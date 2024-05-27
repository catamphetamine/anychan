import type { UserDataOperation, UserDataCollection } from '@/types'

import { getUnderlyingCollectionType } from './collection.utility.js'

export default function validateOperationArguments(
	args: any[],
	{ op, collection }: { op: UserDataOperation, collection: UserDataCollection }
) {
	const collectionType = getUnderlyingCollectionType(collection.type)

	const validateArgumentsCount = (expectedArgsCount: number) => {
		if (args.length !== expectedArgsCount) {
			throw new Error(`Incorrect "${op}" operation arguments for collection "${collection.name}" of type "${collection.type}". Expected ${expectedArgsCount} argument${expectedArgsCount === 1 ? '' : 's'}. Got ${args.length} argument${args.length === 1 ? '' : 's'}:\n${JSON.stringify(args, null, 2)}`)
		}
	}

	const onUnsupportedOperationForCollectionType = () => {
		throw new Error(`Unsupported operation "${op}" for collection type "${collection.type}"`)
	}

	const onUnknownCollectionType = () => {
		throw new Error(`Unknown collection type: "${collection.type}"`)
	}

	let value

	switch (op) {
		case 'get':
			switch (collectionType) {
				case 'value':
				case 'list':
				case 'map':
					validateArgumentsCount(0)
					break
				default:
					onUnknownCollectionType()
			}
			break

		case 'getFrom':
			switch (collectionType) {
				case 'value':
					onUnsupportedOperationForCollectionType()
				case 'list':
				case 'map':
					validateArgumentsCount(1)
					break
				default:
					onUnknownCollectionType()
			}
			break

		case 'remove':
			switch (collectionType) {
				case 'value':
				case 'list':
				case 'map':
					validateArgumentsCount(0)
					break
				default:
					onUnknownCollectionType()
			}
			break

		case 'set':
			switch (collectionType) {
				case 'value':
				case 'list':
				case 'map':
					validateArgumentsCount(1)
					break
				default:
					onUnknownCollectionType()
			}
			value = args[args.length - 1]
			break

		case 'mergeWith':
			switch (collectionType) {
				case 'value':
				case 'list':
				case 'map':
					validateArgumentsCount(1)
					break
				default:
					onUnknownCollectionType()
			}
			value = args[args.length - 1]
			break

		case 'addTo':
			switch (collectionType) {
				case 'value':
					onUnsupportedOperationForCollectionType()
				case 'list':
					validateArgumentsCount(1)
					break
				case 'map':
					onUnsupportedOperationForCollectionType()
					break
				default:
					onUnknownCollectionType()
			}
			value = args[args.length - 1]
			break

		case 'setIn':
			switch (collectionType) {
				case 'value':
					onUnsupportedOperationForCollectionType()
				case 'list':
					validateArgumentsCount(1)
					break
				case 'map':
					validateArgumentsCount(2)
					break
				default:
					onUnknownCollectionType()
			}
			value = args[args.length - 1]
			break

		case 'removeFrom':
			switch (collectionType) {
				case 'value':
					onUnsupportedOperationForCollectionType()
				case 'list':
				case 'map':
					validateArgumentsCount(1)
					break
				default:
					onUnknownCollectionType()
			}
			break

		default:
			throw new Error(`Unknown operation: "${op}"`)
	}

	return { value }
}