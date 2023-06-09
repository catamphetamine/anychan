import { getSubscribedThreads } from '../../redux/subscribedThreads.js'
import reSortSubscribedThreads from './reSortSubscribedThreads.js'

export default function onSubscribedThreadsChanged({
	userData,
	dispatch,
	sort
}) {
	if (sort) {
		reSortSubscribedThreads({ userData })
	}
	dispatch(getSubscribedThreads({ userData }))
}