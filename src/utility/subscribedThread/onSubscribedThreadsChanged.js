import { getSubscribedThreads } from '../../redux/subscribedThreads.js'
import sortSubscribedThreads from './sortSubscribedThreads.js'

export default function onSubscribedThreadsChanged({
	userData,
	dispatch,
	previousSubscribedThreads,
	newSubscribedThreads,
	sort
}) {
	if (newSubscribedThreads) {
		sortSubscribedThreads(newSubscribedThreads, { userData })

		if (previousSubscribedThreads) {
			const areEqual = areSubscribedThreadsListsEqual(previousSubscribedThreads, newSubscribedThreads)
			if (areEqual) {
				return
			}
			userData.setSubscribedThreads(newSubscribedThreads)
			return newSubscribedThreads
		}
	} else {
		if (sort) {
			const subscribedThreads = userData.getSubscribedThreads()
			sortSubscribedThreads(subscribedThreads, { userData })
			userData.setSubscribedThreads(subscribedThreads)
		}
		dispatch(getSubscribedThreads({ userData }))
	}
}

function areSubscribedThreadsListsEqual(prevSubscribedThreads, newSubscribedThreads) {
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