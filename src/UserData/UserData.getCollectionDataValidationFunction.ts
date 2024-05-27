import type { UserDataCollection, UserDataCollectionType } from '@/types'

import schemaValidation from 'flexible-json-schema'

import { getUnderlyingCollectionType } from './collection.utility.js'

// Adds collection data validation functions.
export default function getCollectionDataValidationFunction(
	collection: UserDataCollection,
	{ target }: { target?: 'item' } = {}
) {
	let { schema } = collection

	// Set up schemas for default types.
	if (!schema) {
		schema = getSchemaForCollectionType(collection.type)
	}

	// Every collection must have a schema describing the data.
	if (!schema) {
		throw new Error(`Collection "${collection.name}" must define a \`schema\``)
	}

	// For "list" collections, `schema` describes an item in the list.
	if (getUnderlyingCollectionType(collection.type) === 'list') {
		// Create list item validation function.
		if (target === 'item') {
			return schemaValidation(schema)
		}

		// Transform the schema so that it describes the whole list.
		return schemaValidation({
			arrayOf: schema,
			nonEmpty: false,
			description: 'List'
		})
	}

	// For "map" collections, `schema` describes an item of the map.
	if (getUnderlyingCollectionType(collection.type) === 'map') {
		// Create map item validation function.
		if (target === 'item') {
			return schemaValidation(schema)
		}

		// Transform the schema so that it describes the whole map.
		return schemaValidation({
			objectOf: schema,
			description: 'Map'
		})
	}

	if (getUnderlyingCollectionType(collection.type) === 'value') {
		// "value" collections don't have a concept of an "item".
		if (target === 'item') {
			throw new Error(`Collection "${collection.name}" of type "${collection.type}" doesn\'t have a concept of an item schema when creating a data validation function`)
		}

		return schemaValidation(schema)
	}

	throw new Error(`Unsupported collection type "${collection.type}" of collection "${collection.name}" when creating a data validation function`)
}

function getSchemaForCollectionType(type: UserDataCollectionType) {
	switch (type) {
		case 'channels-threads-comments':
			return {
				type: 'positiveInteger',
				description: 'Comment ID'
			}
		case 'channels-threads':
			return {
				type: 'positiveInteger',
				description: 'Thread ID'
			}
	}
}