import type { SubscribedThread } from '@/types'

export function onStartLocked(subscribedThread: SubscribedThread) {
	subscribedThread.locked = true
	// `createSubscribedThreadRecord()` is called from `onSubscribedThreadFetched()`.
	// If it did set `lockedAt` date as `new Date(now)` then such `lockedAt` date
	// would change every time such subscribed thread record is regenerated
	// when there're new comments.
	// subscribedThread.lockedAt = new Date(now)
}

export function onStopLocked(subscribedThread: SubscribedThread) {
	delete subscribedThread.locked
	delete subscribedThread.lockedAt
}

export function onStartTrimming(subscribedThread: SubscribedThread) {
	subscribedThread.trimming = true
	// // Remove some data that's not supposed to be in a "trimming" thread record.
	// if (subscribedThread.commentsCount !== undefined) {
	// 	delete subscribedThread.commentsCount
	// }
	// if (subscribedThread.latestComment.number !== undefined) {
	// 	delete subscribedThread.latestComment.number
	// }
}

export function onStopTrimming(subscribedThread: SubscribedThread) {
	delete subscribedThread.trimming
	// `commentsCount` and `latestComment` are set in the parent function.
}

export function onStartArchived(subscribedThread: SubscribedThread, archivedAt?: Date) {
	subscribedThread.archived = true
	if (archivedAt) {
		subscribedThread.archivedAt = archivedAt
	} else {
		// subscribedThread.archivedAt = new Date(now)
	}
}

export function onStopArchived(subscribedThread: SubscribedThread) {
	delete subscribedThread.archived
	delete subscribedThread.archivedAt
}

export function onStartExpired(subscribedThread: SubscribedThread) {
	subscribedThread.expired = true
	// subscribedThread.expiredAt = new Date(now)

	// Don't delete thread archival marks.
	// There could be cases when a thread's page incorrectly returns "404 Not Found"
	// due to an incorrect web server configuration, or a DDoS attack, etc.
	// In those cases, when things get back to normal, the thread is un-marked as `expired`,
	// and in those cases the thread's `archived` data could be restored if it has been preserved.
	//
	// Also, the current `changed = true` logic is written in such a way that whenever
	// a `subscribedThread` record is not marked as `archived` and is found to be archived,
	// the `changed` flag is set to `true` and it will be updated as `archived: true` anyway.
	//
	// delete subscribedThread.archived
	// delete subscribedThread.archivedAt
}

export function onStopExpired(subscribedThread: SubscribedThread) {
	delete subscribedThread.expired
	delete subscribedThread.expiredAt
}