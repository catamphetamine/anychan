import type { Dispatch, UserData, ChannelId, ThreadId, SubscribedThreadKey } from '@/types'
import type SubscribedThreadsUpdater from '../SubscribedThreadsUpdater/SubscribedThreadsUpdater.js'

import { getSubscribedThreads } from '../../redux/subscribedThreads.js'

export default function removeSubscribedThread(subscribedThreadKey: SubscribedThreadKey, {
	userData,
	dispatch,
	subscribedThreadsUpdater
}: {
	userData: UserData,
	dispatch: Dispatch,
	subscribedThreadsUpdater?: SubscribedThreadsUpdater
}) {
	userData.removeSubscribedThread(subscribedThreadKey)
	userData.removeSubscribedThreadIdFromChannel(subscribedThreadKey.channel.id, subscribedThreadKey.id)
	userData.removeSubscribedThreadState(subscribedThreadKey.channel.id, subscribedThreadKey.id)

	// Perfoms any required sync-ups after unsubscribing from a thread.
	onUnsubscribedFromThread({ dispatch, userData })
}

// Perfoms any required sync-ups after unsubscribing from a thread.
function onUnsubscribedFromThread({
	subscribedThreadsUpdater,
	dispatch,
	userData
}: {
	subscribedThreadsUpdater?: SubscribedThreadsUpdater,
	dispatch: Dispatch,
	userData: UserData
}) {
	// No need to notify Subscribed Threads Updater
	// because it will review the list of subscribed threads upon running anyway.
	// subscribedThreadsUpdater.reset()

	// Refresh the list of subscribed threads in the sidebar.
	dispatch(getSubscribedThreads({ userData }))
}