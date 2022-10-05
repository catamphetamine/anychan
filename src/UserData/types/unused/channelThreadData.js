import { isEqual } from 'lodash-es'

export function setChannelIdThreadIdData(
	{ encode },
	channelIdThreadIdData = {},
	channelId,
	threadId,
	data
) {
	if (!channelIdThreadIdData[channelId]) {
		channelIdThreadIdData[channelId] = {}
	}
	threadId = String(threadId)
	channelIdThreadIdData[channelId][threadId] = encode(data)
	return channelIdThreadIdData
}

export function removeChannelIdThreadIdData(
	{ key },
	channelIdThreadIdData,
	channelId,
	threadId,
	data
) {
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
		return null
	} else {
		return channelIdThreadIdData
	}
}

export function getChannelIdThreadIdData(
	{ decode },
	channelIdThreadIdData = {},
	channelId,
	threadId
) {
	if (channelId) {
		const threadIdData = channelIdThreadIdData[channelId] || {}
		if (threadId) {
			threadId = String(threadId)
			let _data = threadIdData[threadId]
			_data = decode(_data)
			return _data
		}
		return decodeChannelData(threadIdData, decode)
	}
	return decodeRootData(channelIdThreadIdData, decode)
}

export function mergeChannelIdThreadIdData(
	{ key, merge },
	channelIdThreadIdData = {},
	data
) {
	for (const channelId of Object.keys(data)) {
		const threadIdData = channelIdThreadIdData[channelId]
		if (!threadIdData) {
			channelIdThreadIdData[channelId] = threadIdData = {}
		}
		for (const threadId of Object.keys(data[channelId])) {
			// `data` is already encoded.
			const newValue = data[channelId][threadId]
			if (threadIdData[threadId] === newValue) {
				continue
			} else if (threadIdData[threadId] === undefined) {
				threadIdData[threadId] = newValue
			} else {
				if (merge) {
					threadIdData[threadId] = merge(
						threadIdData[threadId],
						newValue
					)
					continue
				}
				// // For numbers a greater one usually means a later one.
				// // For example, "latest seen thread id" or "latest read comment id".
				// // So only replace the existing value if it's a number
				// // and if the number is greater than the existing one.
				// // In all other cases it's not determined how the merging process
				// // should be performed so just skip those cases.
				// if (typeof newValue === 'number') {
				// 	if (newValue > threadIdData[threadId]) {
				// 		threadIdData[threadId] = newValue
				// 	}
				// 	continue
				// } else if (compare) {
				// 	if (compare(threadIdData[threadId], newValue) < 0) {
				// 		threadIdData[threadId] = newValue
				// 	}
				// 	continue
				// }
				threadIdData[threadId] = newValue
			}
		}
	}
	return channelIdThreadIdData
}

function decodeChannelData(data, decode) {
	for (const threadId of Object.keys(data)) {
		data[threadId] = decode(data[threadId])
	}
	return data
}

function decodeRootData(data, decode) {
	for (const channelId of Object.keys(data)) {
		decodeChannelData(data[channelId], decode)
	}
	return data
}