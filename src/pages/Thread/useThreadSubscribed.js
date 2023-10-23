import { useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { subscribeToThread, unsubscribeFromThread } from '../../redux/subscribedThreads.js'

import useUserData from '../../hooks/useUserData.js'

/**
 * Same concept as `useState()` but for a thread's "subscribed" status.
 * @param  {object} options.channel
 * @param  {object} options.thread
 * @return {Array} Returns `[isSubscribed, setSubscribed]`
 */
export default function useThreadSubscribed({
	channel,
	thread
}) {
	const userData = useUserData()
	const dispatch = useDispatch()

	const subscribedThreads = useSelector(state => state.subscribedThreads.subscribedThreads)

	const isThreadSubscribed = useMemo(() => {
		return userData.isSubscribedThread(channel.id, thread.id)
	}, [
		channel,
		thread,
		subscribedThreads
	])

	const setThreadSubscribed = useCallback((isSubscribed) => {
		if (isSubscribed) {
			dispatch(subscribeToThread(thread, { channel, userData }))
		} else {
			dispatch(unsubscribeFromThread({
				id: thread.id,
				channel: {
					id: channel.id
				}
			}, {
				userData
			}))
		}
	}, [
		channel,
		thread
	])

	return [
		isThreadSubscribed,
		setThreadSubscribed
	]
}