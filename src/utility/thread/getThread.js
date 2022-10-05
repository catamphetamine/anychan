import { getThread as getThreadAction } from '../../redux/data.js'

import getUserData from '../../UserData.js'

import onThreadFetched from './onThreadFetched.js'
import onThreadExpired from './onThreadExpired.js'

export default async function getThread(
	channelId,
	threadId,
	getThreadActionParameters,
	{
		dispatch,
		createGetThreadAction = getThreadAction,
		userData = getUserData(),
		timer
	}
) {
	try {
		const thread = await dispatch(createGetThreadAction(channelId, threadId, getThreadActionParameters))
		onThreadFetched(thread, { dispatch, userData, timer })
		return thread
	} catch (error) {
		if (error.status === 404) {
			// Clear expired thread from user data.
			onThreadExpired(channelId, threadId, { dispatch, userData })
		}
		throw error
	}
}