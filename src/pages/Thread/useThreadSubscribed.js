import { useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { subscribeToThread, unsubscribeFromThread } from '../../redux/subscribedThreads.js'
import getUserData from '../../UserData.js'

/**
 * Same concept as `useState()` but for a thread's "subscribed" status.
 * @param  {object} options.channel
 * @param  {object} options.thread
 * @return {Array} Returns `[isSubscribed, setSubscribed]`
 */
export default function useThreadSubscribed({
	channel,
	thread,
	userData = getUserData()
}) {
	const subscribedThreads = useSelector(state => state.subscribedThreads.subscribedThreads)

	const isThreadSubscribed = useMemo(() => {
		return Boolean(userData.getSubscribedThread(channel.id, thread.id))
	}, [
		channel,
		thread,
		subscribedThreads
	])

	const dispatch = useDispatch()

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