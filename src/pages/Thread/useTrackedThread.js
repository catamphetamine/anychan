import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { trackThread, untrackThread } from '../../redux/trackedThreads'
import createTrackedThreadRecord from '../../utility/createTrackedThreadRecord'

export default function useTrackedThread({
	channel,
	thread
}) {
	const dispatch = useDispatch()
	const isThreadTracked = useSelector(({ trackedThreads }) => {
		if (trackedThreads.trackedThreadsIndex[channel.id]) {
			return trackedThreads.trackedThreadsIndex[channel.id].includes(thread.id)
		}
	})
	const onSetThreadTracked = useCallback((shouldTrackThread) => {
		if (shouldTrackThread) {
			dispatch(trackThread(createTrackedThreadRecord(thread, channel)))
		} else {
			dispatch(untrackThread({
				id: thread.id,
				channel: {
					id: channel.id
				}
			}))
		}
	}, [
		channel,
		thread
	])
	return [
		isThreadTracked,
		onSetThreadTracked
	]
}