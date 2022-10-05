export function setChannelIdThreadIds({ encode }, _, channelIdThreadIds) {
	return channelIdThreadIds[channelId]
}

export function addToChannelIdThreadIds(
	{ encode },
	threadIdsByChannelId = {},
	channelId,
	threadId
) {
	if (!threadIdsByChannelId[channelId]) {
		threadIdsByChannelId[channelId] = []
	}
	const index = threadIdsByChannelId[channelId].indexOf(threadId)
	if (index < 0) {
		threadIdsByChannelId[channelId].push(threadId)
		return threadIdsByChannelId
	}
}

export function removeFromChannelIdThreadIds(
	{ key },
	threadIdsByChannelId = {},
	channelId,
	threadId
) {
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
		return null
	} else {
		return threadIdsByChannelId
	}
}

export function getFromChannelIdThreadIds(
	{ decode },
	threadIdsByChannelId = {},
	channelId,
	threadId
) {
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

export function mergeWithChannelIdThreadIds(
	{ key },
	channelIdThreadIds = {},
	data
) {
	for (const channelId of Object.keys(data)) {
		const threadIds = channelIdThreadIds[channelId]
		if (!threadIds) {
			channelIdThreadIds[channelId] = threadIds = []
		}
		// Add all thread IDs.
		for (const threadId of data[channelId]) {
			if (threadIds.indexOf(threadId) < 0) {
				threadIds.push(threadId)
			}
		}
	}
	return channelIdThreadIds
}