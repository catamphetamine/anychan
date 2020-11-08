import { useMemo } from 'react'
import { useSelector } from 'react-redux'

export default function useTrackedThreads({
	maxListLength,
	snapshot
}) {
	const _trackedThreads = useSelector(({ threadTracker }) => threadTracker.trackedThreads)
	// Snapshot tracked threads list when entering edit mode,
	// so that they're not rearranged while the user is editing the list,
	// so that the user doesn't accidentally click the "delete" button
	// on a thread list item that wasn't intended to be clicked.
	const trackedThreadsSnapshot = useMemo(() => _trackedThreads, [snapshot])
	const trackedThreads = snapshot ? trackedThreadsSnapshot : _trackedThreads
	const hasMoreThreads = trackedThreads.length > maxListLength
	const liveThreads = trackedThreads.filter(_ => !_.expired)
	const hasMoreLiveThreads = liveThreads.length > maxListLength
	const allThreadsCount = trackedThreads.length
	const liveThreadsCount = liveThreads.length
	const hasExpiredThreads = allThreadsCount - liveThreadsCount > 0
	function getShownTrackedThreads(viewMode) {
		if (viewMode !== 'all') {
			if (viewMode === 'top') {
				return liveThreads.slice(0, maxListLength)
			} else if (viewMode === 'live') {
				return liveThreads
			}
		}
		return trackedThreads
	}
	return [
		trackedThreads,
		hasMoreThreads,
		hasMoreLiveThreads,
		hasExpiredThreads,
		getShownTrackedThreads
	]
}