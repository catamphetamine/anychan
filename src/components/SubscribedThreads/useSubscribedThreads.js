import { useMemo } from 'react'
import { useSelector } from 'react-redux'

export default function useSubscribedThreads({
	maxListLength,
	snapshot
}) {
	const _subscribedThreads = useSelector(state => state.subscribedThreads.subscribedThreads)

	// Snapshot subscribed threads list when entering edit mode,
	// so that they're not rearranged while the user is editing the list,
	// so that the user doesn't accidentally click the "delete" button
	// on a thread list item that wasn't intended to be clicked.
	const subscribedThreadsSnapshot = useMemo(() => _subscribedThreads, [snapshot])

	const subscribedThreads = snapshot ? subscribedThreadsSnapshot : _subscribedThreads

	const hasMoreThreads = subscribedThreads.length > maxListLength
	const liveThreads = subscribedThreads.filter(_ => !_.expired)
	const hasLiveThreads = liveThreads.length > 0
	const hasMoreLiveThreads = liveThreads.length > maxListLength
	const allThreadsCount = subscribedThreads.length
	const liveThreadsCount = liveThreads.length
	const hasExpiredThreads = allThreadsCount - liveThreadsCount > 0

	function getShownSubscribedThreads(viewMode) {
		if (viewMode !== 'all') {
			if (viewMode === 'top') {
				return liveThreads.slice(0, maxListLength)
			} else if (viewMode === 'live') {
				return liveThreads
			}
		}
		return subscribedThreads
	}

	return [
		subscribedThreads,
		hasMoreThreads,
		hasLiveThreads,
		hasMoreLiveThreads,
		hasExpiredThreads,
		getShownSubscribedThreads
	]
}