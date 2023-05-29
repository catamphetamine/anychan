import getThreadUrlPattern from './getThreadUrlPattern.js'

export default function getThreadUrl(dataSource, { channelId, threadId, notSafeForWork }) {
	return getThreadUrlPattern(dataSource, { notSafeForWork })
		.replace('{channelId}', channelId)
		.replace('{threadId}', threadId)
}
