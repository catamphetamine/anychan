export function setValue(storage, key, value) {
	storage.set(key, value)
}

export function removeValue(storage, key) {
	storage.delete(key)
}

export function getValue(storage, key) {
	return storage.get(key)
}

export function mergeValue(storage, key, value) {
	return setValue(storage, key, value)
}