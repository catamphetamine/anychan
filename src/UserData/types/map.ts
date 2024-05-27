import type { UserDataTypeOperation, UserDataChunkDataEncoded, UserDataChunkData } from "@/types"

export const setInMap: UserDataTypeOperation = ({ encode }, map = {}, key, item) => {
	if (key === undefined) {
		throw new Error('`key` argument is required when setting an item in a "map" collection')
	}
	if (item === undefined) {
		throw new Error('`item` argument is required when setting it in a "map" collection')
	}
	// Create a new map for explicit "reference inequality"
	// signaling that the map has changed.
	return {
		...map,
		[key]: encode(item)
	}
}

export const setMap: UserDataTypeOperation = ({ encode }, previousMap, map) => {
	const newMap: Record<string, UserDataChunkDataEncoded> = {}
	for (const key in map) {
		newMap[key] = encode(map[key])
	}
	return newMap
}

export const removeFromMap: UserDataTypeOperation = ({ encode }, map, key) => {
	if (key === undefined) {
		throw new Error('`key` argument is required when removing an item from a "map" collection')
	}
	// If the map (or item) doesn't exist, then don't do anything.
	if (!map || !map.hasOwnProperty(key)) {
		return
	}
	// Create a new map for explicit "reference inequality"
	// signaling that the map has changed.
	const newMap: Record<string, UserDataChunkDataEncoded> = {}
	let isEmpty = true
	for (const _key in map) {
		if (_key !== key) {
			newMap[_key] = encode(map[_key])
			isEmpty = false
		}
	}
	if (isEmpty) {
		// Returning `null` signals that the map should be removed:
		// there's no point in having an empty map.
		return null
	}
	return newMap
}

export const getMap: UserDataTypeOperation = ({ decode }, map = {}) => {
	// Return the whole map.
	const decodedMap: Record<string, UserDataChunkData> = {}
	for (const key in map) {
		decodedMap[key] = decode(map[key])
	}
	return decodedMap
}

export const getFromMap: UserDataTypeOperation = ({ decode }, map = {}, key) => {
	if (key === undefined) {
		throw new Error('`key` argument is required when getting an item from a "map" collection')
	}
	// Return the item from the map.
	if (!map.hasOwnProperty(key)) {
		return
	}
	return decode(map[key])
}

// `data` is already encoded. No need to `encode()` it.
export const mergeWithMap: UserDataTypeOperation = ({ encode, decode, merge }, map = {}, data) => {
	for (const key in data) {
		if (map.hasOwnProperty(key)) {
			map[key] = merge(map[key], data[key])
		} else {
			map[key] = data[key]
		}
	}
	return map
}