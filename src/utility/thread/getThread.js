import { getHttpClient } from 'react-pages'

import { getThread as getThreadAction, callGetThreadApi } from '../../redux/data.js'

// import _getThread from '../../api/getThread.js'

import getMessages from '../../messages/index.js'

import onThreadFetched from './onThreadFetched.js'
import onThreadExpired from './onThreadExpired.js'

export default async function getThread(
	channelId,
	threadId,
	parametersForGetThreadAction,
	{
		dispatch,
		createGetThreadAction = getThreadAction,
		userData,
		timer,
		updateThreadInState
	}
) {
	try {
		const parameters = parametersForGetThreadAction

		let thread
		if (updateThreadInState) {
			thread = await dispatch(createGetThreadAction(
				channelId,
				threadId,
				{
					...parameters,
					userData
				}
			))
		} else {
			thread = await callGetThreadApi(
				channelId,
				threadId,
				parameters,
				{
					http: getHttpClient(),
					userData
				}
			)
		}

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