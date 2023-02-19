import { getHttpClient } from 'react-pages'

import {
	getThread as createGetThreadAction,
	refreshThread as createRefreshThreadAction
} from '../../redux/data.js'

import _getThread from '../../api/getThread.js'

import getMessages from '../../messages/index.js'

import onThreadFetched from './onThreadFetched.js'
import onThreadExpired from './onThreadExpired.js'

export default async function getThread(
	{
		channelId,
		threadId,
		thread: existingThread
	},
	parameters,
	{
		action,
		dispatch,
		getThreadStub,
		updateThreadInState,
		userData,
		userSettings,
		timer,
		http
	}
) {
	try {
		let thread
		switch (action) {
			case 'getThreadInState':
				thread = await dispatch(createGetThreadAction(
					channelId,
					threadId,
					{
						...parameters,
						userData,
						userSettings
					}
				))
				break
			case 'refreshThreadInState':
				thread = (await dispatch(createRefreshThreadAction(
					existingThread,
					{
						...parameters,
						userData,
						userSettings
					}
				))).thread
				break
			case 'getThread':
				thread = await _getThread({
					channelId,
					threadId,
					...parameters,
					messages: getMessages(parameters.locale),
					http: getHttpClient(),
					userData,
					userSettings
				})
				break
			case 'getThreadStub':
				getThreadStub()
				break
			default:
				throw new Error(`Unknown "action" parameter received in "getThread()" function: "${action}"`)
		}

		if (action !== 'getThreadStub') {
			onThreadFetched(thread, { dispatch, userData, timer })
		}

		return thread
	} catch (error) {
		if (error.status === 404) {
			// Clear expired thread from user data.
			onThreadExpired(channelId, threadId, { dispatch, userData })
		}
		throw error
	}
}