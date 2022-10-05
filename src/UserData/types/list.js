export function addToList({ encode, decode, compare, maxCount, trim, isEqual }, list = [], item) {
	if (item === undefined) {
		throw new Error('`item` argument is required when adding it to a "list" collection')
	}

	item = encode(item)

	// Won't add duplicates.
	// `item` is already encoded.
	if (has(list, item, isEqual)) {
		return
	}

	// Create a new list for explicit "reference inequality"
	// signaling that the list has changed.
	// Concat with an array of `item` because just `.contact(item)`
	// would expand the `item` argument if it was an array.
	list = list.concat([item])

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

export function setInList({ encode, decode, isEqual, compare }, list = [], item) {
	if (item === undefined) {
		throw new Error('`item` argument is required when setting it in a "list" collection')
	}

	item = encode(item)

	let index
	if (isEqual) {
		index = list.findIndex(_ => isEqual(_, item))
	} else {
		index = list.indexOf(item)
	}

	if (index < 0) {
		return
	}

	// Create a new list for explicit "reference inequality"
	// signaling that the list has changed.
	// Wrote it as `.conat([item])` instead of just `.concat(item)`
	// because just `.contact(item)` would behave in a weird manner
	// if the `item` happened to be an array.
	list = list.slice(0, index).concat([item]).concat(list.slice(index + 1))

	return list
}

export function setList({ encode }, previousList, list) {
	return list.map(encode)
}

export function removeFromList({ isEqual, encode }, list, item) {
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
	} else if (isEqual) {
		index = list.findIndex(_ => isEqual(_, item))
	} else {
		item = encode(item)
		index = list.indexOf(item)
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

export function getList({ decode }, list = []) {
	// Return the whole list.
	return list.map(decode)
}

export function getFromList({ isEqual, encode, decode }, list = [], item) {
	if (item === undefined) {
		throw new Error('`item` argument is required when getting it from a "list" collection')
	}
	// Return the item from the list.
	item = get(list, item, isEqual, encode)
	if (item === undefined) {
		return
	}
	return decode(item)
}

// `data` is already encoded.
export function mergeWithList({ encode, decode, merge, isEqual, maxCount, trim, compare }, list = [], data) {
	for (const item of data) {
		// `data` is already encoded, so not passing the `encode` argument to `findIndex()`.
		const index = findIndex(list, item, isEqual)
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

function findIndex(list, item, isEqual, encode) {
	if (typeof item === 'function') {
		return list.findIndex(item)
	} else if (isEqual) {
		return list.findIndex(_ => isEqual(_, item))
	} else {
		if (encode) {
			item = encode(item)
		}
		return list.indexOf(item)
	}
}

function get(list, item, isEqual, encode) {
	const index = findIndex(list, item, isEqual, encode)
	if (index >= 0) {
		// Returns the item just to conform the the method return type spec:
		// "returns `undefined` if the item wasn't found, non-`undefined` otherwise".
		return list[index]
	}
	return
}

function has(list, item, isEqual, encode) {
	return get(list, item, isEqual, encode) !== undefined
}

function trimList(list, maxCount, trim) {
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