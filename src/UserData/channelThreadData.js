export function addToChannelIdThreadIdData(storage, key, collection, channelId, threadId, data) {
	const channelIdThreadIdData = storage.get(key, {})
	if (!channelIdThreadIdData[channelId]) {
		channelIdThreadIdData[channelId] = {}
	}
	threadId = String(threadId)
	channelIdThreadIdData[channelId][threadId] = encode(data, collection)
	storage.set(key, channelIdThreadIdData)
}

export function removeFromChannelIdThreadIdData(storage, key, collection, channelId, threadId, data) {
	const channelIdThreadIdData = storage.get(key, {})
	if (threadId) {
		const threadIdData = channelIdThreadIdData[channelId]
		if (!threadIdData) {
			return
		}
		threadId = String(threadId)
		if (data) {
			if (threadIdData[threadId] !== data) {
				return
			}
		}
		delete threadIdData[threadId]
		if (Object.keys(threadIdData).length === 0) {
			delete channelIdThreadIdData[channelId]
		}
	} else {
		delete channelIdThreadIdData[channelId]
	}
	if (Object.keys(channelIdThreadIdData).length === 0) {
		storage.delete(key)
	} else {
		storage.set(key, channelIdThreadIdData)
	}
}

export function getFromChannelIdThreadIdData(storage, key, collection, channelId, threadId, data) {
	const channelIdThreadIdData = storage.get(key, {})
	if (channelId) {
		const threadIdData = channelIdThreadIdData[channelId] || {}
		if (threadId) {
			threadId = String(threadId)
			let _data = threadIdData[threadId]
			_data = decode(_data, collection, 'thread')
			if (data) {
				return _data === data
			}
			return _data
		}
		return decode(threadIdData, collection, 'channel')
	}
	return decode(channelIdThreadIdData, collection, 'root')
}

export function mergeWithChannelIdThreadIdData(storage, key, collection, data) {
	const channelIdThreadIdData = storage.get(key, {})
	for (const channelId of Object.keys(data)) {
		const threadIdData = channelIdThreadIdData[channelId]
		if (!threadIdData) {
			channelIdThreadIdData[channelId] = threadIdData = {}
		}
		for (const threadId of Object.keys(data[channelId])) {
			const newValue = encode(data[channelId][threadId], collection)
			if (threadIdData[threadId] === newValue) {
				continue
			} else if (threadIdData[threadId] === undefined) {
				threadIdData[threadId] = newValue
			} else {
				// For numbers a greater one usually means a later one.
				// For example, "latest seen thread id" or "latest read comment id".
				// So only replace the existing value if it's a number
				// and if the number is greater than the existing one.
				// In all other cases it's not determined how the merging process
				// should be performed so just skip those cases.
				if (typeof newValue === 'number') {
					if (newValue > threadIdData[threadId]) {
						threadIdData[threadId] = newValue
					}
					continue
				}
				console.warn(`No merging strategy specified for "${key}"`)
			}
		}
	}
	return channelIdThreadIdData
}

function encode(data, collection) {
	if (collection.encode) {
		data = collection.encode(data)
	}
	return data
}

function decodeThreadData(data, collection) {
	return collection.decode(data)
}

function decodeChannelData(data, collection) {
	for (const threadId of Object.keys(data)) {
		data[threadId] = decodeThreadData(data[threadId], collection)
	}
	return data
}

function decodeRootData(data, collection) {
	for (const channelId of Object.keys(data)) {
		decodeChannelData(data[channelId], collection)
	}
	return data
}

function decode(data, collection, level) {
	if (data === undefined || !collection.decode) {
		return data
	}
	switch (level) {
		case 'thread':
			return decodeThreadData(data, collection)
		case 'channel':
			return decodeChannelData(data, collection)
		case 'root':
			return decodeRootData(data, collection)
		default:
			throw new Error(`Unsupported data tree level: ${level}`)
	}
}