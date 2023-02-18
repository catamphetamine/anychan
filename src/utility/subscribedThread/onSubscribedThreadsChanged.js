import { getSubscribedThreads } from '../../redux/subscribedThreads.js'
import sortSubscribedThreads from './sortSubscribedThreads.js'

export default function onSubscribedThreadsChanged({
	userData,
	dispatch,
	sort
}) {
	let alteredSubscribedThreads

	if (sort) {
		const previousSubscribedThreads = userData.getSubscribedThreads()
		const newSubscribedThreads = previousSubscribedThreads.slice()
		sortSubscribedThreads(newSubscribedThreads, { userData })
		const isSameOrder = isSubscribedThreadsListsOrderEqual(previousSubscribedThreads, newSubscribedThreads)
		if (!isSameOrder) {
			userData.setSubscribedThreads(newSubscribedThreads)
			alteredSubscribedThreads = newSubscribedThreads
		}
	}

	if (dispatch) {
		dispatch(getSubscribedThreads({ userData }))
	} else {
		return alteredSubscribedThreads
	}
}

function isSubscribedThreadsListsOrderEqual(prevSubscribedThreads, newSubscribedThreads) {
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