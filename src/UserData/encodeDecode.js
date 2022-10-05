import { cloneDeep } from 'lodash-es'

// "Decodes" data after it has been read from disk.
export function decodeData(data, collection) {
	if (data === undefined) {
		return
	}
	if (collection.decode) {
		// `data` will be "mutated".
		return collection.decode(cloneDeep(data))
	}
	return data
}

// "Encodes" data before storing it on disk.
export function encodeData(data, collection) {
	if (data === undefined) {
		return
	}
	if (collection.encode) {
		// `data` will be "mutated".
		return collection.encode(cloneDeep(data))
	}
	return data
}