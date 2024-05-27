import type { UserDataCollections } from "@/types"

export default function validateCollections(collections: UserDataCollections) {
	// Validate collections' `shortName`s.
	validateCollectionsShortNames(collections)
}

function validateCollectionsShortNames(collections: UserDataCollections) {
	for (const collectionName of Object.keys(collections) as Array<keyof typeof collections>) {
		const collection = collections[collectionName]

		// Check that every collection has a `name` and an optional `shortName`.
		const { name, shortName } = collection

		if (!name) {
			throw new Error(`Collection "${collectionName}" must specify a \`name\` property.`)
		}

		if (shortName === undefined) {
			throw new Error(`Collection "${collectionName}" must specify a \`shortName\` property: it could be either a single-character string or \`null\` for "no short name".`)
		}

		// Check `shortName` length.
		// https://www.castilloandres.com/blog/tech/en/how-to-count-characters-in-a-javascript-string.html
		if (typeof shortName === 'string' && Array.from(shortName).length > 2) {
			throw new Error(`Collection "${collectionName}" specifies a \`shortName\` of length ${Array.from(shortName).length} which is longer than a single character. Keep \`shortName\`s as short as a couple of UTF-8 characters to occupy less space on disk.`)
		}

		// Check `shortName` uniqueness.
		if (shortName !== null) {
			for (const otherCollectionName of Object.keys(collections)) {
				if (otherCollectionName !== collectionName) {
					if (collections[otherCollectionName].shortName === collection.shortName) {
						throw new Error(`Collection "${collectionName}" specifies a \`shortName\` that is already in use by "${otherCollectionName}" collection.`)
					}
				}
			}
		}
	}
}