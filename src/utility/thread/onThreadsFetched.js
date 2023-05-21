import { getSubscribedThreads } from '../../redux/subscribedThreads.js'
import onSubscribedThreadFetched from '../subscribedThread/onSubscribedThreadFetched.js'
import onSubscribedThreadsChanged from '../subscribedThread/onSubscribedThreadsChanged.js'
import createByIdIndex from '../createByIdIndex.js'

export default function onThreadsFetched(channelId, threads, {
	dispatch,
	userData,
	timer
}) {
	const subscribedThreadIdsForThisChannel = userData.getSubscribedThreadIdsForChannel(channelId) || []

	const getThreadById = createByIdIndex(threads)

	let subscribedThreadsHaveChanged = false

	// Update the list of existing threads for the channel.
	userData.setThreads(channelId, threads.map(thread => thread.id))

	// Update any affected subscribed threads for the channel.
	for (const threadId of subscribedThreadIdsForThisChannel) {
		const thread = getThreadById(threadId)
		if (thread) {
			// Update subscribed thread record from newly fetched thread data.
			// Although that data is not complete, there's still some info
			// like the `locked` / `expired` / `archived` / `trimming` flags.
			if (onSubscribedThreadFetched(thread, { min: true, userData, timer })) {
				subscribedThreadsHaveChanged = true
			}
		} else {
			// The thread has been archived or has expired.
			// It's not clear whether the thread is archived or has simply expired.
			// So don't update the subscribed thread's status here.
			// It will be updated by a scheduled subscribed thread updater anyway.
			//
			// const subscribedThread = userData.getSubscribedThread(thread.channelId, thread.id)
			// // There's a hypothetical possibility that `subscribedThreadsIndex` and
			// // `subscribedThreads` collections are out of sync due to some glitch.
			// if (subscribedThread) {
			// 	// It's not clear whether the thread is archived or has simply expired.
			// 	onStartArchived(subscribedThread)
			// }
		}
	}

	if (subscribedThreadsHaveChanged) {
		// Re-render the list of subscribed threads.
		// For example, if some of them have expired,
		// then re-render them as such.
		onSubscribedThreadsChanged({ dispatch, userData, sort: true })
	}
}

// import onThreadsList from '../UserData/onThreadsList'

// // Clear expired threads from user data.
// const {
// 	threadArchive,
// 	threadArchiveLifetime,
// 	threadArchiveLifetimeInfinite
// } = dataSource

// // See if any of the subscribed threads have expired.
// // if some threads are missing from the `threads` list
// // then it would mean that those ones have expired.
// const { subscribedThreadsArchivedOrExpired } = onThreadsList(channelId, threads, {
// 	userData,
// 	threadArchive,
// 	threadArchiveLifetime,
// 	threadArchiveLifetimeInfinite
// })