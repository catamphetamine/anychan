export function setChannelIdThreadIdCommentIdData(
	{ encode },
	channelIdThreadIdCommentIdData = {},
	channelId,
	threadId,
	commentId,
	data
) {
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
	commentIdData[commentId] = encode(data)
	return channelIdThreadIdCommentIdData
}

export function removeChannelIdThreadIdCommentIdData(
	{ key },
	channelIdThreadIdCommentIdData,
	channelId,
	threadId,
	commentId
) {
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
		return null
	} else {
		return channelIdThreadIdCommentIdData
	}
}

export function getChannelIdThreadIdCommentIdData(
	{ decode },
	channelIdThreadIdCommentIdData = {},
	channelId,
	threadId,
	commentId
) {
	if (channelId) {
		const threadIdCommentIdData = channelIdThreadIdCommentIdData[channelId] || {}
		if (threadId) {
			threadId = String(threadId)
			const commentIdData = threadIdCommentIdData[threadId] || {}
			if (commentId) {
				commentId = String(commentId)
				return decode(commentIdData[commentId])
			}
			return decodeThreadData(commentIdData, decode)
		}
		return decodeChannelData(threadIdCommentIdData, decode)
	}
	return decodeRootData(channelIdThreadIdCommentIdData, decode)
}

export function mergeChannelIdThreadIdCommentIdData(
	{ key, merge },
	channelIdThreadIdCommentIdData = {},
	data
) {
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
				// (`data` is already encoded).
				if (commentIdData.hasOwnProperty(String(commentId))) {
					if (merge) {
						commentIdData[commentId] = merge(
							commentIdData[commentId],
							data[channelId][threadId][commentId]
						)
						continue
					}
				}
				// Overwrite any possible previous data with new data.
				commentIdData[commentId] = data[channelId][threadId][commentId]
			}
		}
	}
	return channelIdThreadIdCommentIdData
}

function decodeThreadData(data, decode) {
	for (const commentId of Object.keys(data)) {
		data[commentId] = decode(data[commentId])
	}
	return data
}

function decodeChannelData(data, decode) {
	for (const threadId of Object.keys(data)) {
		decodeThreadData(data[threadId], decode)
	}
	return data
}

function decodeRootData(data, decode) {
	for (const channelId of Object.keys(data)) {
		decodeChannelData(data[channelId], decode)
	}
	return data
}