import type { Channel, Thread, ChannelId, ThreadId, UserData } from '@/types'
import type { Dispatch } from 'redux'
import type { Timer } from 'web-browser-timer'

import {
	setThread,
	setThreadRefreshed,
	setThreadBeingFetched,
	setThreadIsBeingRefreshed
} from '../../redux/thread.js'

import getThreadApi from '../../api/getThread.js'

import onThreadFetched from './onThreadFetched.js'
import onThreadExpired from './onThreadExpired.js'
import onSubscribedThreadFetchError from '../subscribedThread/onSubscribedThreadFetchError.js'

type GetThreadStubParameters = Pick<Parameters<typeof getThreadApi>[0], 'channelId' | 'threadId'>

export type GetThreadParameters = Omit<
	Parameters<typeof getThreadApi>[0],
	'channelId' | 'threadId'
> & {
	channels?: Channel[],
	requestedBy?: 'auto-update',
	dispatch: Dispatch,
	purpose: 'threadPageLoad' | 'threadPageRefresh' | 'getThread' | 'getThreadStub',
	getThreadStub?: (parameters: GetThreadStubParameters) => ReturnType<typeof getThreadApi>
}

type Callback = (error: Error | null, result?: { thread: Thread, channel?: Channel }) => void;

// Fetches a thread and calls the `callback()` with either a `{ thread, channel }` result object
// or an `error` instance.
//
// This function adds some "supplementary" code to the "core" "fetch thread" functionality.
// That "supplementary" code performs various "utility" tasks that're required for the app's operation.
//
// Those "utility" tasks are the reason why the different kinds of "fetch thread" calls
// have been combined in this single file: that's just to make those "utility" tasks always run
// whenever someone fetches a thread for any purpose.
//
export default async function getThread(
	channelId: ChannelId,
	threadId: ThreadId,
	parameters: GetThreadParameters & { timer?: Timer }
): Promise<{ thread: Thread, channel?: Channel }> {
	return await new Promise((resolve, reject) => {
		try {
			getThreadUsingCallback(
				channelId,
				threadId,
				parameters,
				(error: Error, result) => {
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

// Fetches a thread and calls the `callback()` with either a `{ thread, channel }` result object
// or an `error` instance.
//
// This function adds some "supplementary" code to the `callback()`
// that performs various "utility" tasks that're required for the app's operation.
//
// A rationale on why it uses a `callback()` rather than a `Promise`:
//
// `SubscribedThreadsUpdater` was partially rewritten without `async`/`await`
// and with using `callback`s instead. The reason is that `async`/`await`
// or `Promise` don't work well with `timer.fastForward()` in tests.
// So `async`/`await` and `Promise`s have been rewritten in `callback`s,
//
export function getThreadUsingCallback(
	channelId: ChannelId,
	threadId: ThreadId,
	{ timer, ...parameters }: GetThreadParameters & { timer?: Timer },
	callback: Callback
) {
	getThreadUsingCallback_(
		addCustomCodeToGetThreadCallback(
			callback,
			channelId,
			threadId,
			{ timer, ...parameters }
		),
		channelId,
		threadId,
		parameters
	)
}

// ("core" version) (internal use only)
// Fetches a thread and calls the `callback()` with either a `{ thread, channel }` result object
// or an `error` instance.
async function getThreadUsingCallback_(
	callback: Callback,
	...args: Parameters<typeof getThread_>
) {
	try {
		callback(null, await getThread_.apply(this, args))
	} catch (error) {
		callback(error)
	}
}

// Adds "supplementary" code to `getThread()` `callback` parameter.
// The "supplementary" code does various "utility" stuff that is required for the app's operation:
// * If the thread is not found, it marks it as "expired" in User Data.
// * If the thread is found, it updates User Data from the up-to-date thread info.
function addCustomCodeToGetThreadCallback(
	callback: Callback,
	channelId: ChannelId,
	threadId: ThreadId,
	{ timer, ...parameters }: GetThreadParameters & { timer?: Timer }
) {
	return (error: Error, result?: Parameters<Callback>[1]) => {
		const {
			dispatch,
			userData
		} = parameters

		onAfterThreadFetched(result && result.thread, {
			error,
			channelId,
			threadId,
			dispatch,
			userData,
			timer
		})

		if (error) {
			return callback(error)
		}

		callback(null, result)
	}
}

// The "core" thread-fetching logic.
async function getThread_(
	channelId: ChannelId,
	threadId: ThreadId,
	{
		purpose,
		dispatch,
		getThreadStub,
		userData,
		userSettings,
		dataSource,
		threadBeforeRefresh,
		...parameters
	}: GetThreadParameters
): Promise<{
	thread: Thread,
	channel?: Channel
}> {
	const fetchThread = async (parameters: Omit<
		Parameters<typeof getThreadApi>[0],
		'channelId' | 'threadId' | 'userData' | 'userSettings' | 'dataSource'
	>): Promise<{
		thread: Thread,
		channel?: Channel
	}> => {
		return await getThreadApi({
			channelId,
			threadId,
			userData,
			userSettings,
			dataSource,
			...parameters
		})
	}

	switch (purpose) {
		// Fetches a `Thread`.
		// Sets it as `state.data.thread` in Redux state.
		// Returns the `Thread`.
		case 'threadPageLoad':
			try {
				dispatch(setThreadBeingFetched({ channelId, threadId }))
				const {
					channels,
					requestedBy,
					...rest
				} = parameters
				const { channel, thread } = await fetchThread(rest)
				dispatch(setThread({
					channels,
					requestedBy,
					channel,
					thread
				}))
				return { channel, thread }
			} finally {
				// "Get thread" action might throw an error.
				dispatch(setThreadBeingFetched(undefined))
			}

		// Re-fetches a `Thread`.
		// Sets it as `state.data.thread` in Redux state.
		// Returns the `Thread`.
		case 'threadPageRefresh':
			try {
				dispatch(setThreadIsBeingRefreshed(true))
				const {
					channels,
					requestedBy,
					// `threadBeforeRefresh` feature is not currently used, but `imageboard` library
					// still supports using the "-tail" data URL when fetching thread comments
					// on `4chan.org` to reduce the traffic a bit. See `4chan.org` API docs
					// of the `imageboard` library for more details on how "-tail" data URL works.
					// This feature hasn't been tested and is not currently used.
					// threadBeforeRefresh: thread,
					...rest
				} = parameters
				const { channel, thread } = await fetchThread(rest)
				dispatch(setThreadRefreshed({
					thread,
					threadBeforeRefresh,
					channels,
					requestedBy,
					userData
				}))
				return { channel, thread }
			} finally {
				// "Refresh thread" action might throw an error.
				dispatch(setThreadIsBeingRefreshed(false))
			}

		// Fetches a `Thread`.
		// Returns the `Thread`.
		case 'getThread':
			return await fetchThread(parameters)

		// Fetches a `Thread` ("stub").
		// Returns the `Thread` ("stub").
		//
		// `getThreadStub()` function is a "stub" ("mock") and it's only used in tests.
		//
		case 'getThreadStub':
			return await getThreadStub({ channelId, threadId })

		default:
			throw new Error(`Unknown "purpose" parameter received in "getThread()" function: "${purpose}"`)
	}
}

function onAfterThreadFetched(thread: Thread | null, {
	channelId,
	threadId,
	error,
	dispatch,
	userData,
	timer
}: {
	channelId: ChannelId,
	threadId: ThreadId,
	error?: Error,
	dispatch: Dispatch,
	userData: UserData,
	timer?: Timer
}) {
	if (error) {
		// @ts-expect-error
		if (error.status === 404) {
			// Clear expired thread from user data.
			onThreadExpired(
				channelId,
				threadId,
				{ dispatch, userData }
			)
		} else {
			onSubscribedThreadFetchError({
				channelId,
				threadId
			}, {
				userData
			})
		}
	} else {
		onThreadFetched(thread, { dispatch, userData, timer })
	}
}