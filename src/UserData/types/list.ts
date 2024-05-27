import type { UserDataTypeOperation, UserDataCollection, UserDataChunkDataEncoded } from "@/types"

export const addToList: UserDataTypeOperation = (
	{ encode, decode, compare, maxCount, trim, match },
	list = [],
	item
) => {
	if (item === undefined) {
		throw new Error('`item` argument is required when adding it to a "list" collection')
	}

	// Won't add duplicates.
	if (has(list, item, match, encode)) {
		return
	}

	// Create a new list for explicit "reference inequality"
	// signaling that the list has changed.
	// Concat with an array of `item` because just `.contact(item)`
	// would expand the `item` argument if it was an array.
	list = list.concat([encode(item)])

	// Sort the updated list.
	if (compare) {
		list = list.map(decode)
		list.sort(compare)
		list = list.map(encode)
	}

	// Apply `maxCount`, if configured.
	if (maxCount !== undefined) {
		list = trimList(list, maxCount, trim)
	}

	return list
}

export const setInList: UserDataTypeOperation = (
	{ encode, match },
	list = [],
	item
) => {
	if (item === undefined) {
		throw new Error('`item` argument is required when setting it in a "list" collection')
	}

	let index
	if (match) {
		index = list.findIndex((_: UserDataChunkDataEncoded) => match(_, item))
	} else {
		index = list.indexOf(encode(item))
	}

	if (index < 0) {
		return
	}

	// Create a new list for explicit "reference inequality"
	// signaling that the list has changed.
	// Wrote it as `.conat([item])` instead of just `.concat(item)`
	// because just `.contact(item)` would behave in a weird manner
	// if the `item` happened to be an array.
	list = list.slice(0, index).concat([encode(item)]).concat(list.slice(index + 1))

	return list
}

export const setList: UserDataTypeOperation = (
	{ encode },
	previousList,
	list
) => {
	return list.map(encode)
}

export const removeFromList: UserDataTypeOperation = (
	{ match, encode },
	list,
	item
) => {
	// If the collection doesn't exist (same as "is empty"), then don't do anything.
	if (!list) {
		return
	}

	if (item === undefined) {
		throw new Error('`item` argument is required when removing it from a "list" collection')
	}

	let index
	if (typeof item === 'function') {
		index = list.findIndex(item)
	} else if (match) {
		index = list.findIndex((_: UserDataChunkDataEncoded) => match(_, item))
	} else {
		index = list.indexOf(encode(item))
	}
	if (index < 0) {
		return
	}

	// Create a new list for explicit "reference inequality"
	// signaling that the list has changed.
	// list.splice(index, 1)
	list = list.slice(0, index).concat(list.slice(index + 1))
	if (list.length === 0) {
		// Returning `null` signals that the collection should be removed:
		// there's no point in having an empty list.
		return null
	}
	return list
}

export const getList: UserDataTypeOperation = ({ decode }, list = []) => {
	// Return the whole list.
	return list.map(decode)
}

export const getFromList: UserDataTypeOperation = ({ match, encode, decode }, list = [], item) => {
	if (item === undefined) {
		throw new Error('`item` argument is required when getting it from a "list" collection')
	}
	// Return the item from the list.
	// The original `item` argument is not necessarily the whole item. It might be just some "key" properties of it.
	item = getItemFromListEncoded(list, item, match, encode)
	if (item === undefined) {
		return
	}
	return decode(item)
}

// `data` is already encoded.
export const mergeWithList: UserDataTypeOperation = ({ encode, decode, merge, match, maxCount, trim, compare }, list = [], data) => {
	for (const item of data) {
		// `data` is already encoded, so not passing the `encode` argument to `findIndex()`.
		const index = findIndex(list, decode(item), match, encode)
		if (index >= 0) {
			if (merge) {
				// `list[index]` is encoded.
				// `item` is encoded.
				list[index] = merge(list[index], item)
			}
		} else {
			list.push(item)
		}
	}
	if (maxCount !== undefined) {
		list = trimList(list, maxCount, trim)
	}
	if (compare) {
		list = list.map(decode)
		list.sort(compare)
		list = list.map(encode)
	}
	return list
}

function findIndex(list: any[], item: any, match: UserDataCollection['match'], encode: UserDataCollection['encode']) {
	if (typeof item === 'function') {
		return list.findIndex(item)
	} else if (match) {
		return list.findIndex(_ => match(_, item))
	} else {
		return list.indexOf(encode(item))
	}
}

function getItemFromListEncoded(list: any[], item: any, match: UserDataCollection['match'], encode: UserDataCollection['encode']) {
	const index = findIndex(list, item, match, encode)
	if (index >= 0) {
		// Returns the item just to conform the the method return type spec:
		// "returns `undefined` if the item wasn't found, non-`undefined` otherwise".
		return list[index]
	}
	return
}

function has(list: any[], item: any, match: UserDataCollection['match'], encode: UserDataCollection['encode']) {
	return getItemFromListEncoded(list, item, match, encode) !== undefined
}

function trimList(list: any[], maxCount: number, trim: UserDataCollection['trim']) {
	if (trim) {
		list = trim(list, maxCount)
	}
	if (list.length > maxCount) {
		// Discard the items at the start of the list.
		list = list.slice(
			list.length - maxCount,
			list.length
		)
	}
	return list
}