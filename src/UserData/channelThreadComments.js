export function addToChannelIdThreadIdCommentIds(storage, key, channelId, threadId, commentId) {
	const channelIdThreadIdCommentIds = storage.get(key, {})
	let threadIdCommentIds = channelIdThreadIdCommentIds[channelId]
	if (!threadIdCommentIds) {
		threadIdCommentIds = {}
		channelIdThreadIdCommentIds[channelId] = threadIdCommentIds
	}
	threadId = String(threadId)
	let commentIds = threadIdCommentIds[threadId]
	if (!commentIds) {
		commentIds = []
		threadIdCommentIds[threadId] = commentIds
	}
	const index = commentIds.indexOf(commentId)
	if (index < 0) {
		commentIds.push(commentId)
		commentIds.sort()
		storage.set(key, channelIdThreadIdCommentIds)
	}
}

export function removeFromChannelIdThreadIdCommentIds(storage, key, channelId, threadId, commentId) {
	let channelIdThreadIdCommentIds = storage.get(key)
	if (!channelIdThreadIdCommentIds) {
		return
	}
	if (threadId) {
		const threadIdCommentIds = channelIdThreadIdCommentIds[channelId]
		if (!threadIdCommentIds) {
			return
		}
		threadId = String(threadId)
		if (commentId) {
			const commentIds = threadIdCommentIds[threadId]
			if (!commentIds) {
				return
			}
			const index = commentIds.indexOf(commentId)
			if (index < 0) {
				return
			}
			commentIds.splice(index, 1)
			if (commentIds.length === 0) {
				delete threadIdCommentIds[threadId]
			}
		} else {
			delete threadIdCommentIds[threadId]
		}
		if (Object.keys(threadIdCommentIds).length === 0) {
			delete channelIdThreadIdCommentIds[channelId]
		}
	} else {
		delete channelIdThreadIdCommentIds[channelId]
	}
	if (Object.keys(channelIdThreadIdCommentIds).length === 0) {
		storage.delete(key)
	} else {
		storage.set(key, channelIdThreadIdCommentIds)
	}
}

export function getFromChannelIdThreadIdCommentIds(storage, key, channelId, threadId, commentId) {
	const channelIdThreadIdCommentIds = storage.get(key, {})
	if (channelId) {
		const threadIdCommentIds = channelIdThreadIdCommentIds[channelId] || {}
		if (threadId) {
			threadId = String(threadId)
			const commentIds = threadIdCommentIds[threadId] || []
			if (commentId) {
				const index = commentIds.indexOf(commentId)
				return index >= 0
			}
			return commentIds
		}
		return threadIdCommentIds
	}
	return channelIdThreadIdCommentIds
}

export function mergeWithChannelIdThreadIdCommentIds(storage, key, data) {
	const channelIdThreadIdCommentIds = storage.get(key, {})
	for (const channelId of Object.keys(data)) {
		const threadIdCommentIds = channelIdThreadIdCommentIds[channelId]
		if (!threadIdCommentIds) {
			channelIdThreadIdCommentIds[channelId] = threadIdCommentIds = {}
		}
		for (const threadId of Object.keys(data[channelId])) {
			let commentIds = threadIdCommentIds[threadId]
			if (!commentIds) {
				threadIdCommentIds[threadId] = commentIds = []
			}
			for (const commentId of data[channelId][threadId]) {
				if (commentIds.indexOf(commentId) < 0) {
					commentIds.push(commentId)
					commentIds.sort()
				}
			}
		}
	}
	return channelIdThreadIdCommentIds
}