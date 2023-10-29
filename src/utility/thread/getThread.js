import { getHttpClient } from 'react-pages'

import {
	getThread as createGetThreadAction,
	refreshThread as createRefreshThreadAction,
	setThreadBeingFetched,
	setThreadIsBeingRefreshed
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
		dataSource,
		timer,
		http
	}
) {
	try {
		let thread
		switch (action) {
			// Fetches a `Thread`.
			// Sets it as `state.data.thread` in Redux state.
			// Returns the `Thread`.
			case 'getThreadAndPutItInState':
				try {
					dispatch(setThreadBeingFetched({ channelId, threadId }))
					thread = (await dispatch(createGetThreadAction(
						channelId,
						threadId,
						{
							...parameters,
							userData,
							userSettings,
							dataSource
						}
					))).thread
				} finally {
					// "Get thread" action might throw an error.
					dispatch(setThreadBeingFetched(undefined))
				}
				break

			// Re-fetches a `Thread`.
			// Sets it as `state.data.thread` in Redux state.
			// Returns the `Thread`.
			case 'refreshThreadInState':
				try {
					dispatch(setThreadIsBeingRefreshed(true))
					thread = (await dispatch(createRefreshThreadAction(
						existingThread,
						{
							...parameters,
							userData,
							userSettings,
							dataSource
						}
					))).thread
				} finally {
					// "Refresh thread" action might throw an error.
					dispatch(setThreadIsBeingRefreshed(false))
				}
				break

			// Fetches a `Thread`.
			// Returns the `Thread`.
			case 'getThread':
				thread = await _getThread({
					channelId,
					threadId,
					...parameters,
					messages: getMessages(parameters.locale),
					http: getHttpClient(),
					userData,
					userSettings,
					dataSource
				})
				break

			// Fetches a `Thread` ("stub").
			// This function is a "stub" ("mock") and it's only used in tests.
			case 'getThreadStub':
				thread = await getThreadStub({ channelId, threadId })
				break

			default:
				throw new Error(`Unknown "action" parameter received in "getThread()" function: "${action}"`)
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