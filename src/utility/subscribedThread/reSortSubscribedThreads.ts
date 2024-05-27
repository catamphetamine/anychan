import type { SubscribedThread, UserData } from '@/types'

import sortSubscribedThreads from './sortSubscribedThreads.js'

// Re-sorts the list of subscribed threads in `userData`.
// Returns `true` if the order has changed.
export default function reSortSubscribedThreads({ userData }: { userData: UserData }) {
	const previousSubscribedThreads = userData.getSubscribedThreads()
	const newSubscribedThreads = previousSubscribedThreads.slice()
	sortSubscribedThreads(newSubscribedThreads, { userData })
	const hasOrderChanged = !isSubscribedThreadsListsOrderEqual(previousSubscribedThreads, newSubscribedThreads)
	if (hasOrderChanged) {
		userData.setSubscribedThreads(newSubscribedThreads)
	}
	return hasOrderChanged
}

function isSubscribedThreadsListsOrderEqual(
	prevSubscribedThreads: SubscribedThread[],
	newSubscribedThreads: SubscribedThread[]
) {
	if (prevSubscribedThreads.length !== newSubscribedThreads.length) {
		return false
	}
	let i = 0
	while (i < prevSubscribedThreads.length) {
		const prevThread = prevSubscribedThreads[i]
		const newThread = newSubscribedThreads[i]
		if (!(prevThread.id === newThread.id && prevThread.channel.id === newThread.channel.id)) {
			return false
		}
		i++
	}
	return true
}