import { getHttpClient } from 'react-pages'

import {
	getThread as createGetThreadAction,
	refreshThread as createRefreshThreadAction,
	setThreadBeingFetched,
	setThreadIsBeingRefreshed
} from '../../redux/data.js'

import _getThread from '../../api/getThread.js'

import getMessages from '../../messages/getMessages.js'

import onThreadFetched from './onThreadFetched.js'
import onThreadExpired from './onThreadExpired.js'
import onSubscribedThreadFetchError from '../subscribedThread/onSubscribedThreadFetchError.js'

// Fetches a thread.
// Performs some additional actions after the thread has been fetched.
// For example, it updates the corresponding "subscribed thread" record
// with the latest info, if that record exists.
// Those "additional actions" are the reason why different kinds of "fetch thread"
// actions have been combined in this single file: that's just to make those
// "additional actions" always run whenever someone fetches a thread using any of the actions.
export default async function getThread(
	threadInfo,
	getThreadParameters,
	options
) {
	return await new Promise((resolve, reject) => {
		try {
			getThreadCustomWithCallback(
				getThreadFunctionDefaultWithCallback,
				threadInfo,
				getThreadParameters,
				options,
				(error, result) => {
					if (error) {
						reject(error)
					} else {
						resolve(result)
					}
				}
			)
		} catch (error) {
			reject(error)
		}
	})
}

// `SubscribedThreadsUpdater` was partially rewritten without `async`/`await`
// and with using `callback`s instead. The reason is that `async`/`await`
// or `Promise` don't work well with `timer.fastForward()` in tests.
// So `async`/`await` and `Promise`s have been rewritten in `callback`s,
export async function getThreadWithCallback(
	threadInfo,
	getThreadParameters,
	options,
	callback
) {
	getThreadCustomWithCallback(
		getThreadFunctionDefaultWithCallback,
		threadInfo,
		getThreadParameters,
		options,
		callback
	)
}

async function getThreadCustomWithCallback(
	getThreadFunctionWithCallback,
	threadInfo,
	getThreadParameters,
	{ timer, ...options },
	callback
) {
	getThreadFunctionWithCallback(
		threadInfo,
		getThreadParameters,
		options,
		(error, thread) => {
			const {
				dispatch,
				userData
			} = options

			if (error) {
				const {
					channelId,
					threadId,
					thread
				} = threadInfo

				const channelId_ = thread ? thread.channelId : channelId
				const threadId_ = thread ? thread.id : threadId

				if (error.status === 404) {
					// Clear expired thread from user data.
					onThreadExpired(
						channelId_,
						threadId_,
						{ dispatch, userData }
					)
				} else {
					onSubscribedThreadFetchError({
						channelId: channelId_,
						threadId: threadId_
					}, {
						userData
					})
				}
				return callback(error)
			}

			onThreadFetched(thread, { dispatch, userData, timer })
			callback(null, thread)
		}
	)
}

async function getThreadFunctionDefaultWithCallback(...args) {
	const callback = args.pop()
	try {
		callback(null, await getThreadFunctionDefault(...args))
	} catch (error) {
		callback(error)
	}
}

async function getThreadFunctionDefault(
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
		http
	}
) {
	switch (action) {
		// Fetches a `Thread`.
		// Sets it as `state.data.thread` in Redux state.
		// Returns the `Thread`.
		case 'getThreadAndPutItInState':
			try {
				dispatch(setThreadBeingFetched({ channelId, threadId }))
				return (await dispatch(createGetThreadAction(
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
				return (await dispatch(createRefreshThreadAction(
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
			return await _getThread({
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
			return await getThreadStub({ channelId, threadId })
			break

		default:
			throw new Error(`Unknown "action" parameter received in "getThread()" function: "${action}"`)
	}
}