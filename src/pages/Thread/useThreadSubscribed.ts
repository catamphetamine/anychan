import type { Thread } from '@/types'

import { useCallback, useMemo } from 'react'
import { useDispatch } from 'react-redux'

import addSubscribedThread from '@/utility/subscribedThread/addSubscribedThread.js'
import removeSubscribedThread from '@/utility/subscribedThread/removeSubscribedThread.js'

import useUserData from '../../hooks/useUserData.js'
import useSelector from '../../hooks/useSelector.js'

/**
 * Same concept as `useState()` but for a thread's "subscribed" status.
 * @param  {object} options.thread
 * @return {Array} Returns `[isSubscribed, setSubscribed]`
 */
export default function useThreadSubscribed({ thread }: { thread: Thread }) {
	const userData = useUserData()
	const dispatch = useDispatch()

	const subscribedThreads = useSelector(state => state.subscribedThreads.subscribedThreads)

	const isThreadSubscribed = useMemo(() => {
		return userData.isSubscribedThread(thread.channelId, thread.id)
	}, [
		thread,
		subscribedThreads
	])

	const setThreadSubscribed = useCallback((isSubscribed: boolean) => {
		if (isSubscribed) {
			addSubscribedThread({ thread, dispatch, userData })
		} else {
			removeSubscribedThread({
				id: thread.id,
				channel: {
					id: thread.channelId
				}
			}, { userData, dispatch })
		}
	}, [
		thread
	])

	return {
		isThreadSubscribed,
		setThreadSubscribed
	}
}