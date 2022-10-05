export function setChannelIdData(
	{ encode },
	channelIdData = {},
	channelId,
	data
) {
	if (!channelIdData[channelId]) {
		channelIdData[channelId] = {}
	}
	channelIdData[channelId] = encode(data)
	return channelIdData
}

export function removeChannelIdData(
	{ encode },
	channelIdData = {},
	channelId,
	data
) {
	if (!channelIdData[channelId]) {
		return
	}
	if (data) {
		data = encode(data)
		if (channelIdData[channelId] !== data) {
			return
		}
	}
	delete channelIdData[channelId]
	if (Object.keys(channelIdData).length === 0) {
		return null
	} else {
		return channelIdData
	}
}

export function getChannelIdData(
	{ decode },
	channelIdData = {},
	channelId,
	data
) {
	if (channelId) {
		const _data = decode(channelIdData[channelId])
		if (data) {
			return _data === data
		}
		return _data
	}
	return decodeRootData(channelIdData, decode)
}

export function mergeChannelIdData(
	{ key, merge },
	channelIdData = {},
	data
) {
	for (const channelId of Object.keys(data)) {
		// `data` is already encoded.
		const newValue = data[channelId]
		if (channelIdData[channelId] === newValue) {
			continue
		} else if (channelIdData[channelId] === undefined) {
			channelIdData[channelId] = newValue
		} else {
			if (merge) {
				channelIdData[channelId] = merge(channelIdData[channelId], newValue)
				continue
			}
			// // For numbers a greater one usually means a later one.
			// // For example, "latest seen thread id" or "latest read comment id".
			// // So only replace the existing value if it's a number
			// // and if the number is greater than the existing one.
			// // In all other cases it's not determined how the merging process
			// // should be performed so just skip those cases.
			// if (typeof newValue === 'number') {
			// 	if (newValue > channelIdData[channelId]) {
			// 		channelIdData[channelId] = newValue
			// 	}
			// 	continue
			// }
			channelIdData[channelId] = newValue
		}
	}
	return channelIdData
}

function decodeRootData(data, decode) {
	for (const channelId of Object.keys(data)) {
		data[channelId] = decode(data[channelId])
	}
	return data
}