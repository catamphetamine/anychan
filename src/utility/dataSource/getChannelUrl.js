import getChannelUrlPattern from './getChannelUrlPattern.js'

export default function getChannelUrl(dataSource, { channelId, notSafeForWork }) {
	return getChannelUrlPattern(dataSource, { notSafeForWork })
		.replace('{channelId}', channelId)
}