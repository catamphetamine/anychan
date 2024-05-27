import type { UserDataCollections, UserDataOperation } from '@/types'

import { getOperations } from './collection.operations.js'
import { getUnderlyingCollectionType } from './collection.utility.js'
import getMethodName from './getMethodName.js'

export default function createCustomDataAccessMethods({ collections }: { collections: UserDataCollections }) {
	for (const collectionName of Object.keys(collections)) {
		const collection = collections[collectionName]
		if (collection.methods) {
			for (const methodName of Object.keys(collection.methods)) {
				const definition = collection.methods[methodName]
				if (this[methodName]) {
					throw new Error(`"${methodName}" method already exists in UserData`)
				}
				// If a method definition is a string then
				// it's an alias for an existing operation.
				if (typeof definition === 'string') {
					const operation = definition
					// console.log(this)
					const operationMethod = this[getMethodName(operation, collectionName)]
					if (!operationMethod) {
						throw new Error(`Method "${getMethodName(operation, collectionName)}" for operation "${operation}" of collection "${collectionName}" of type "${collection.type}" was not found when adding "${methodName}" method to UserData`)
					}
					this[methodName] = operationMethod
				} else {
					const operations = getOperations(getUnderlyingCollectionType(collection.type))
					this[methodName] = definition(
						// Pass all methods available for this collection as parameters
						// to the custom method definition function.
					(Object.keys(operations) as Array<keyof typeof operations>).reduce((collectionMethods, operation) => {
							collectionMethods[operation] = this[getMethodName(operation, collectionName)]
							return collectionMethods
						}, {} as Record<UserDataOperation, Function>)
					)
				}
			}
		}
	}
}