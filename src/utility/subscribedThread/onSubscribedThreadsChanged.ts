import type { UserData } from '@/types'
import type { Dispatch } from 'redux'

import { getSubscribedThreads } from '../../redux/subscribedThreads.js'
import reSortSubscribedThreads from './reSortSubscribedThreads.js'

export default function onSubscribedThreadsChanged({
	userData,
	dispatch,
	sort
}: {
	userData: UserData,
	dispatch: Dispatch,
	sort?: boolean
}) {
	if (sort) {
		reSortSubscribedThreads({ userData })
	}
	dispatch(getSubscribedThreads({ userData }))
}