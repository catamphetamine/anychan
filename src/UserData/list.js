export function addToList(storage, key, item) {
	const list = storage.get(key, [])
	const index = list.indexOf(item)
	if (index < 0) {
		list.push(item)
		storage.set(key, list)
	}
}

export function removeFromList(storage, key, item) {
	const list = storage.get(key)
	if (!list) {
		return
	}
	const index = list.indexOf(item)
	if (index < 0) {
		return
	}
	list.splice(index, 1)
	if (list.length === 0) {
		storage.delete(key)
	} else {
		storage.set(key, list)
	}
}

export function getFromList(storage, key, item) {
	const list = storage.get(key, [])
	if (item) {
		const index = list.indexOf(item)
		return index >= 0
	}
	return list
}

export function mergeWithList(storage, key, data) {
	const list = storage.get(key, [])
	for (const item of data) {
		if (list.indexOf(item) < 0) {
			list.push(item)
		}
	}
	return list
}