import { Timer } from 'web-browser-timer'

import reportError from '../reportError.js'

import {
	onStartLocked,
	onStopLocked,
	onStartArchived,
	onStopArchived,
	// onStartExpired,
	onStopExpired,
	onStartTrimming,
	onStopTrimming
} from './subscribedThreadRecordStatusUpdaters.js'

import createSubscribedThreadStateRecord, {
	createSubscribedThreadStateRecordForIncrementalUpdate
} from './createSubscribedThreadStateRecord.js'

/**
 * Updates subscribed thread info from the fetched thread data.
 * (if there're any changes).
 * @param  {object} thread – Fetched thread data.
 * @param  {boolean} [options.min] — If `true` then the thread data was fetched as part of a "get threads" API ("/catalog.json") call and doesn't contain all thread info compared to a "get thread" API response.
 * @return {boolean} [updated] Returns true if the subscribed thread record was updated.
 */
export default function onSubscribedThreadFetched(thread, {
	min,
	userData,
	timer = new Timer()
} = {}) {
	const subscribedThread = userData.getSubscribedThread(thread.channelId, thread.id)

	// Check that the subscribed thread record exists,
	// if "is subscribed thread" detection was done by some other means.
	if (!subscribedThread) {
		// Shouldn't happen. But just in case it happens for whatever weird reason.
		return reportError(new Error(`Subscribed thread record for /${thread.channelId}/${thread.id} thread was not found`))
	}

	// It's easier to test when it returns `false` rather than `undefined`.
	let changed = false
	let shouldUpdate

	// See if the thread has been locked.
	if (!subscribedThread.locked && thread.locked) {
		onStartLocked(subscribedThread)
		changed = true
	}
	// Or, see if the thread has been unlocked.
	else if (subscribedThread.locked && !thread.locked) {
		onStopLocked(subscribedThread)
		changed = true
	}

	// A thread may change from non-"trimming" to "trimming".
	if (!subscribedThread.trimming && thread.trimming) {
		onStartTrimming(subscribedThread)
		changed = true
	}
	// And, maybe, from "trimming" to non-"trimming".
	else if (subscribedThread.trimming && !thread.trimming) {
		onStopTrimming(subscribedThread)
		changed = true
	}

	// A thread may change from non-"archived" to "archived".
	if (!subscribedThread.archived && thread.archived) {
		onStartArchived(subscribedThread, thread.archivedAt)
		changed = true
	}
	// And, maybe, from "archived" to non-"archived".
	else if (subscribedThread.archived && !thread.archived) {
		onStopArchived(subscribedThread)
		changed = true
	}

	// Sometimes a thread couldn't be fetched if a web server is
	// configured incorrectly, or the website is under a DDoS attack, etc.
	// In such cases, a subscribed thread would get marked with `expired: true`.
	// If some time later the issues are fixed and subscribed threads are accessible again,
	// they should be un-marked as `expired`.
	if (subscribedThread.expired) {
		onStopExpired(subscribedThread)
		changed = true
	}

	// Update subscribed thread stats record.
	// For example, set new comments count.
	let statsChanged = false

	const prevStats = userData.getSubscribedThreadState(thread.channelId, thread.id)

	if (!prevStats) {
		console.error(`"subscribedThreadsState" record not found for subscribed thread "/${thread.channelId}/${thread.id}"`)
	}

	// Patches the existing thread stats record:
	// Resets `refreshErrorAt` / `refreshErrorCount` properties in the thread's stats,
	// since the thread has been fetched "successfully".
	// This is done only when a new stats record doesn't get created.
	const resetErroredState = () => {
		if (prevStats) {
			if (prevStats.refreshErrorAt) {
				delete prevStats.refreshErrorAt
				delete prevStats.refreshErrorCount
				userData.setSubscribedThreadState(
					thread.channelId,
					thread.id,
					prevStats
				)
				statsChanged = true
			}
		}
	}

	if (!min) {
		let newStats

		// In case of an "incremental" thread update.
		// This feature is not currently used.
		if (thread.afterCommentId) {
			if (prevStats) {
				newStats = createSubscribedThreadStateRecordForIncrementalUpdate(thread, {
					prevStats,
					refreshedAt: new Date(timer.now()),
					userData
				})
			} else {
				console.error('Couldn\'t update subscribed thread stats after an incremental thread update without having a previous subscribed thread stats record')
			}
		} else {
			newStats = createSubscribedThreadStateRecord(thread, {
				refreshedAt: new Date(timer.now()),
				userData
			})
		}

		if (newStats) {
			userData.setSubscribedThreadState(
				thread.channelId,
				thread.id,
				newStats
			)

			if (!prevStats || (prevStats.newCommentsCount !== newStats.newCommentsCount)) {
				statsChanged = true
			}

			if (prevStats && prevStats.refreshErrorAt) {
				statsChanged = true
			}
		} else {
			resetErroredState()
		}
	} else {
		resetErroredState()
	}

	// Update subscribed thread record.
	if (changed) {
		subscribedThread.updatedAt = new Date(timer.now())
		// Save the changes.
		userData.updateSubscribedThread(subscribedThread)
	}

	return changed || statsChanged
}

// // The existing "archivedAt" value could be a "hypothetical" one
// // that was previously set by `onThreadsFetched()`
// // after reading `/catalog.json` API response.
// // In that case, replace that "hypothetical" archival date with the actual one.
// if (thread.archivedAt && subscribedThread.archivedAt &&
// 	subscribedThread.archivedAt.getTime() !== thread.archivedAt.getTime()) {
// 	subscribedThread.archivedAt = thread.archivedAt
// 	// An archival date update isn't considered a "significant" change.
// 	// (doesn't impact how the subscribed thread record is rendered in the list)
// 	shouldUpdate = true
// }
//
// // `thread.comments.length` would be incorrect if `min` is `true`.
// // const commentsCount = thread.comments.length
// const commentsCount = thread.commentsCount
//
// if (!hasFullThreadInfo) {
// // In `/catalog.json` API response, there're no thread comments.
// // (only the first ("original") comment is present).
// // Still can use the total comments count though.
// //
// // "Trimming" threads are excluded because older comments in them
// // get erased naturally.
// //
// if (!thread.trimming) {
// 	// New comments count could be less than the old comments count
// 	// in cases when some comments got deleted.
// 	// New comments count could be equal to the old comments count
// 	// doesn't imply that there're no new comments: there could be
// 	// some new comments, with some older comments that got deleted.
// 	// So, comments count is not an "exhaustive" criterion of a thread
// 	// having new comments, but for most cases it is.
// 	if (commentsCount !== subscribedThread.commentsCount) {
// 		console.log(`Comments count changed for thread /${thread.channelId}/${thread.id} from ${subscribedThread.commentsCount} to ${commentsCount} (from "catalog" response).`)
// 		// Don't re-generate the whole subscribed thread info, because, for example,
// 		// `lynxchan` doesn't provide full thread info in `/catalog.json`
// 		// API response, and this function gets called on `/catalog.json`
// 		// API response.
// 		subscribedThread.commentsCount = commentsCount
// 		changed = true
// 	}
// }
// }