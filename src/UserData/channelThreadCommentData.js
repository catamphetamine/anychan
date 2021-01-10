export function setChannelIdThreadIdCommentIdData(storage, key, collection, channelId, threadId, commentId, data) {
	const channelIdThreadIdCommentIdData = storage.get(key, {})
	let threadIdCommentIdData = channelIdThreadIdCommentIdData[channelId]
	if (!threadIdCommentIdData) {
		channelIdThreadIdCommentIdData[channelId] = threadIdCommentIdData = {}
	}
	threadId = String(threadId)
	let commentIdData = threadIdCommentIdData[threadId]
	if (!commentIdData) {
		threadIdCommentIdData[threadId] = commentIdData = {}
	}
	commentId = String(commentId)
	commentIdData[commentId] = encode(data, collection)
	storage.set(key, channelIdThreadIdCommentIdData)
}

export function removeChannelIdThreadIdCommentIdData(storage, key, collection, channelId, threadId, commentId) {
	let channelIdThreadIdCommentIdData = storage.get(key)
	if (!channelIdThreadIdCommentIdData) {
		return
	}
	if (threadId) {
		const threadIdCommentIdData = channelIdThreadIdCommentIdData[channelId]
		if (!threadIdCommentIdData) {
			return
		}
		threadId = String(threadId)
		if (commentId) {
			const commentIdData = threadIdCommentIdData[threadId]
			if (!commentIdData) {
				return
			}
			commentId = String(commentId)
			if (!commentIdData.hasOwnProperty(commentId)) {
				return
			}
			delete commentIdData[commentId]
			if (Object.keys(commentIdData).length === 0) {
				delete threadIdCommentIdData[threadId]
			}
		} else {
			delete threadIdCommentIdData[threadId]
		}
		if (Object.keys(threadIdCommentIdData).length === 0) {
			delete channelIdThreadIdCommentIdData[channelId]
		}
	} else {
		delete channelIdThreadIdCommentIdData[channelId]
	}
	if (Object.keys(channelIdThreadIdCommentIdData).length === 0) {
		storage.delete(key)
	} else {
		storage.set(key, channelIdThreadIdCommentIdData)
	}
}

export function getChannelIdThreadIdCommentIdData(storage, key, collection, channelId, threadId, commentId) {
	const channelIdThreadIdCommentIdData = storage.get(key, {})
	if (channelId) {
		const threadIdCommentIdData = channelIdThreadIdCommentIdData[channelId] || {}
		if (threadId) {
			threadId = String(threadId)
			const commentIdData = threadIdCommentIdData[threadId] || {}
			if (commentId) {
				commentId = String(commentId)
				return decode(commentIdData[commentId], collection, 'comment')
			}
			return decode(commentIdData, collection, 'thread')
		}
		return decode(threadIdCommentIdData, collection, 'channel')
	}
	return decode(channelIdThreadIdCommentIdData, collection, 'root')
}

export function mergeChannelIdThreadIdCommentIdData(storage, key, collection, data) {
	const channelIdThreadIdCommentIdData = storage.get(key, {})
	for (const channelId of Object.keys(data)) {
		const threadIdCommentIdData = channelIdThreadIdCommentIdData[channelId]
		if (!threadIdCommentIdData) {
			channelIdThreadIdCommentIdData[channelId] = threadIdCommentIdData = {}
		}
		for (const threadId of Object.keys(data[channelId])) {
			let commentIdData = threadIdCommentIdData[threadId]
			if (!commentIdData) {
				threadIdCommentIdData[threadId] = commentIdData = {}
			}
			for (const commentId of Object.keys(data[channelId][threadId])) {
				commentIdData[commentId] = encode(data[channelId][threadId][commentId], collection)
			}
		}
	}
	return channelIdThreadIdCommentIdData
}

function encode(data, collection) {
	if (collection.encode) {
		data = collection.encode(data)
	}
	return data
}

function decodeCommentData(data, collection) {
	return collection.decode(data)
}

function decodeThreadData(data, collection) {
	for (const commentId of Object.keys(data)) {
		data[commentId] = decodeCommentData(data[commentId], collection)
	}
	return data
}

function decodeChannelData(data, collection) {
	for (const threadId of Object.keys(data)) {
		decodeThreadData(data[threadId], collection)
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
		case 'comment':
			return decodeCommentData(data, collection)
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