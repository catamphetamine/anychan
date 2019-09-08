export function addToList(storage, key, collection, item) {
	let list = storage.get(key, [])
	let index
	if (collection.isEqual) {
		index = list.findIndex(_ => collection.isEqual(_, item))
	} else {
		index = list.indexOf(item)
	}
	if (index >= 0) {
		return
	}
	// Create a new list for explicit "reference inequality"
	// signaling that the list has changed.
	list = list.concat([item])
	if (collection.limit) {
		list = trimList(list, collection.limit)
	}
	storage.set(key, list)
}

// export function setInList(storage, key, collection, filter, item) {
// 	const list = storage.get(key, [])
// 	const index = list.findIndex(filter)
// 	if (index >= 0) {
// 		list[index] = item
// 		storage.set(key, list)
// 	}
// }

export function removeFromList(storage, key, collection, item) {
	let list = storage.get(key)
	if (!list) {
		return
	}
	let index
	if (typeof item === 'function') {
		index = list.findIndex(item)
	} else if (collection.isEqual) {
		index = list.findIndex(_ => collection.isEqual(_, item))
	} else {
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
		storage.delete(key)
	} else {
		storage.set(key, list)
	}
}

export function getFromList(storage, key, collection, item) {
	const list = storage.get(key, [])
	if (item === undefined) {
		return list
	}
	if (typeof item === 'function') {
		const index = list.findIndex(item)
		if (index >= 0) {
			return list[index]
		}
		return
	} else if (collection.isEqual) {
		return list.find(_ => collection.isEqual(_, item))
	} else {
		const index = list.indexOf(item)
		if (index >= 0) {
			return true
		}
		return false
	}
}

export function mergeWithList(storage, key, collection, data) {
	let list = storage.get(key, [])
	for (const item of data) {
		if (list.indexOf(item) < 0) {
			list.push(item)
		}
	}
	if (collection.limit) {
		list = trimList(list, collection.limit)
	}
	return list
}

function trimList(list, limit) {
	while (list.length > limit) {
		// Remove expired items first.
		let expiredItemIndex = list.findIndex(_ => _.expired)
		if (expiredItemIndex >= 0) {
			list = list.slice(0, expiredItemIndex).concat(list.slice(expiredItemIndex + 1))
		} else {
			// Remove the required amount of non-expired items.
			return list.slice(
				list.length - limit,
				list.length
			)
		}
	}
	// The `list` might have been altered here.
	// (expired items may have been removed)
	return list
}