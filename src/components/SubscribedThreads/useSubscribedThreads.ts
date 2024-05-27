import { useMemo } from 'react'

import { useSelector } from '@/hooks'

export type SubscribedThreadsView = 'alive-top' | 'alive' | 'all'

export default function useSubscribedThreads({
	maxListLength,
	snapshot
}: {
	maxListLength: number,
	snapshot?: boolean
}) {
	const _subscribedThreads = useSelector(state => state.subscribedThreads.subscribedThreads)

	// Snapshot subscribed threads list when entering edit mode,
	// so that they're not rearranged while the user is editing the list,
	// so that the user doesn't accidentally click the "delete" button
	// on a thread list item that wasn't intended to be clicked.
	const subscribedThreadsSnapshot = useMemo(() => _subscribedThreads, [snapshot])

	const subscribedThreads = snapshot ? subscribedThreadsSnapshot : _subscribedThreads
	const aliveThreads = subscribedThreads.filter(_ => !_.expired)

	const allThreadsCount = subscribedThreads.length
	const aliveThreadsCount = aliveThreads.length

	const hasMoreThreads = allThreadsCount > maxListLength
	const hasAliveThreads = aliveThreadsCount > 0
	const hasMoreAliveThreads = aliveThreadsCount > maxListLength
	const hasExpiredThreads = allThreadsCount > aliveThreadsCount

	function getShownSubscribedThreads(viewMode: SubscribedThreadsView) {
		switch (viewMode) {
			case 'alive-top':
				return aliveThreads.slice(0, maxListLength)
			case 'alive':
				return aliveThreads
			case 'all':
				return subscribedThreads
			default:
				throw new Error(`Unknown subscribed threads view mode: "${viewMode}"`)
		}
	}

	return {
		subscribedThreads,
		hasMoreThreads,
		hasAliveThreads,
		hasMoreAliveThreads,
		hasExpiredThreads,
		getShownSubscribedThreads
	}
}