export function addToChannelIdThreadIds(storage, key, channelId, threadId) {
	const threadIdsByChannelId = storage.get(key, {})
	if (!threadIdsByChannelId[channelId]) {
		threadIdsByChannelId[channelId] = []
	}
	const index = threadIdsByChannelId[channelId].indexOf(threadId)
	if (index < 0) {
		threadIdsByChannelId[channelId].push(threadId)
		storage.set(key, threadIdsByChannelId)
	}
}

export function removeFromChannelIdThreadIds(storage, key, channelId, threadId) {
	const threadIdsByChannelId = storage.get(key)
	if (!threadIdsByChannelId) {
		return
	}
	if (!threadIdsByChannelId[channelId]) {
		return
	}
	if (threadId) {
		const index = threadIdsByChannelId[channelId].indexOf(threadId)
		if (index < 0) {
			return
		}
		threadIdsByChannelId[channelId].splice(index, 1)
		if (threadIdsByChannelId[channelId].length === 0) {
			delete threadIdsByChannelId[channelId]
		}
	} else {
		delete threadIdsByChannelId[channelId]
	}
	if (Object.keys(threadIdsByChannelId).length === 0) {
		storage.delete(key)
	} else {
		storage.set(key, threadIdsByChannelId)
	}
}

export function getFromChannelIdThreadIds(storage, key, channelId, threadId) {
	const threadIdsByChannelId = storage.get(key, {})
	if (channelId) {
		const threadIds = threadIdsByChannelId[channelId] || []
		if (threadId) {
			const index = threadIds.indexOf(threadId)
			return index >= 0
		}
		return threadIds
	}
	return threadIdsByChannelId
}

export function mergeWithChannelIdThreadIds(storage, key, data) {
	const channelIdThreadIds = storage.get(key, {})
	for (const channelId of Object.keys(data)) {
		const threadIds = channelIdThreadIds[channelId]
		if (!threadIds) {
			channelIdThreadIds[channelId] = threadIds = []
		}
		for (const threadId of data[channelId]) {
			if (threadIds.indexOf(threadId) < 0) {
				threadIds.push(threadId)
			}
		}
	}
	return channelIdThreadIds
}