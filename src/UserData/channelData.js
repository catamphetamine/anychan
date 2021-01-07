export function addToChannelIdData(storage, key, collection, channelId, data) {
	const channelIdData = storage.get(key, {})
	if (!channelIdData[channelId]) {
		channelIdData[channelId] = {}
	}
	channelIdData[channelId] = encode(data, collection)
	storage.set(key, channelIdData)
}

export function removeFromChannelIdData(storage, key, collection, channelId, data) {
	const channelIdData = storage.get(key, {})
	if (!channelIdData[channelId]) {
		return
	}
	if (data) {
		data = encode(data, collection, 'channel')
		if (channelIdData[channelId] !== data) {
			return
		}
	}
	delete channelIdData[channelId]
	if (Object.keys(channelIdData).length === 0) {
		storage.delete(key)
	} else {
		storage.set(key, channelIdData)
	}
}

export function getFromChannelIdData(storage, key, collection, channelId, data) {
	const channelIdData = storage.get(key, {})
	if (channelId) {
		const _data = decode(channelIdData[channelId], collection, 'channel')
		if (data) {
			return _data === data
		}
		return _data
	}
	return decode(channelIdData, collection, 'root')
}

export function mergeWithChannelIdData(storage, key, collection, data) {
	const channelIdData = storage.get(key, {})
	for (const channelId of Object.keys(data)) {
		const newValue = encode(data[channelId], collection)
		if (channelIdData[channelId] === newValue) {
			continue
		} else if (channelIdData[channelId] === undefined) {
			channelIdData[channelId] = newValue
		} else {
			// For numbers a greater one usually means a later one.
			// For example, "latest seen thread id" or "latest read comment id".
			// So only replace the existing value if it's a number
			// and if the number is greater than the existing one.
			// In all other cases it's not determined how the merging process
			// should be performed so just skip those cases.
			if (typeof newValue === 'number') {
				if (newValue > channelIdData[channelId]) {
					channelIdData[channelId] = newValue
				}
				continue
			}
			console.warn(`No merging strategy specified for "${key}"`)
		}
	}
	return channelIdData
}

function encode(data, collection) {
	if (collection.encode) {
		data = collection.encode(data)
	}
	return data
}

function decodeChannelData(data, collection) {
	return collection.decode(data)
}

function decodeRootData(data, collection) {
	for (const channelId of Object.keys(data)) {
		data[channelId] = decodeChannelData(data[channelId], collection)
	}
	return data
}

function decode(data, collection, level) {
	if (data === undefined || !collection.decode) {
		return data
	}
	switch (level) {
		case 'channel':
			return decodeChannelData(data, collection)
		case 'root':
			return decodeRootData(data, collection)
		default:
			throw new Error(`Unsupported data tree level: ${level}`)
	}
}