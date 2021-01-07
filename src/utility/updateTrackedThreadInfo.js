import isEqual from 'lodash/isEqual'

import UserData from '../UserData/UserData'
import { createTrackedThreadRecordLatestComment } from './createTrackedThreadRecord'

/**
 * Updates tracked thread info from the fetched thread data.
 * (if there're any changes).
 * @param  {object} thread – Fetched thread data.
 * @param  {boolean} [options.hasFullThreadInfo] — Is `true` if the thread data was fetched during a "get thread" API call. Isn't `true` when thread data is read from "/catalog.json" API response.
 * @return {boolean} [updated] Returns true if the tracked thread record was updated.
 */
export default function updateTrackedThreadInfo(thread, { hasFullThreadInfo } = {}) {
	// If this thread is tracked, then update its `latestComment`.
	if (UserData.isTrackedThread(thread.channelId, thread.id)) {
		const trackedThread = UserData.getTrackedThread({
			id: thread.id,
			channel: {
				id: thread.channelId
			}
		})
		// The tracked thread should exist, but just in case something weird happens.
		if (trackedThread) {
			return _updateTrackedThreadInfo(trackedThread, thread, { hasFullThreadInfo })
		} else {
			// Something weird happened.
			const errorMessage = `Thread /${thread.channelId}/${thread.id} was found in the tracked threads index but was not found in the tracked threads list`
			if (typeof window === 'undefined') {
				console.error(errorMessage)
			} else {
				// Report the error.
				setTimeout(() => {
					throw new Error(errorMessage)
				}, 0)
			}
		}
	}
}

/**
 * Updates tracked thread info from the fetched thread data.
 * (if there're any changes).
 * @param  {object} trackedThreadRecord — Tracked thread record.
 * @param  {object} thread – Fetched thread data.
 * @param  {boolean} [options.hasFullThreadInfo] — Is `true` if the thread data was fetched during a "get thread" API call. Isn't `true` when thread data is read from "/catalog.json" API response.
 * @return {boolean} [updated] Returns true if the tracked thread record was updated.
 */
function _updateTrackedThreadInfo(trackedThreadRecord, thread, { hasFullThreadInfo }) {
	// In "get thread comments" API response, full thread info is available.
	if (hasFullThreadInfo) {
		// Update `refreshedAt` timestamp.
		trackedThreadRecord.refreshedAt = Date.now()
		// Get the latest comment in the thread.
		const latestComment = thread.comments[thread.comments.length - 1]
		// Sometimes, only `trackedThreadRecord.latestComment.i` exists, and not the `.id`.
		// The reason is that `/catalog.json` API response doesn't provide any comment ids
		// but does provide the overall comments count from which the
		// `trackedThreadRecord.latestComment.i` is calculated.
		const isLatestCommentIdStored = trackedThreadRecord.latestComment.id !== undefined
		// If there're new comments since the latest tracked thread refresh,
		// or if some of the comments got deleted, then update the tracked
		// thread info. `hasCommentsCountChanged` being `true` doesn't
		// necessarily imply that there're "new" comments: it could be that
		// just some of the old comments got deleted, which caused a difference
		// between previous and new total comments count.
		if (isLatestCommentIdStored) {
			if (latestComment.id === trackedThreadRecord.latestComment.id) {
				// No new comments.
				UserData.updateTrackedThread(trackedThreadRecord)
				return false
			}
		}
		// No need to re-generate the whole tracked thread info.
		// Just update the `.latestComment` part.
		trackedThreadRecord.latestComment = createTrackedThreadRecordLatestComment(latestComment, {
			isRolling: thread.isRolling
		})
		// This code is executed synchronously after `UserData.isTrackedThread()`,
		// so there shouldn't be no "race conditions".
		UserData.updateTrackedThread(trackedThreadRecord)
		return true
	} else {
		// In `/catalog.json` API response, there're no thread comments.
		// (only the first ("original") comment is present).
		// Still can use the total comments count though.
		// "Rolling" threads are excluded because older comments in them
		// get erased naturally.
		if (!thread.isRolling) {
			const prevLatestCommentIndex = trackedThreadRecord.latestComment.i
			// `prevLatestCommentIndex` is `undefined` if the thread was "rolling"
			// at the time it was added to the "tracked threads" list.
			if (prevLatestCommentIndex !== undefined) {
				const newLatestCommentIndex = thread.commentsCount - 1
				// `newLatestCommentIndex` could be less than `prevLatestCommentIndex`
				// in cases when some comments got deleted.
				// `newLatestCommentIndex` could be equal to `prevLatestCommentIndex`
				// if there're new comments and some older comments got deleted.
				// So it's not an "exhaustive" criterion, but most of the time
				// it works as intended.
				if (prevLatestCommentIndex !== newLatestCommentIndex) {
					console.log(`Comments count changed for thread /${thread.channelId}/${thread.id} from ${prevLatestCommentIndex + 1} to ${newLatestCommentIndex + 1} (from "catalog" response).`)
					// Don't re-generate the whole tracked thread info, because, for example,
					// `lynxchan` doesn't provide full thread info in `/catalog.json`
					// API response, and this function gets called on `/catalog.json`
					// API response.
					trackedThreadRecord.latestComment = {
						i: newLatestCommentIndex
					}
					// This code is executed synchronously after `UserData.isTrackedThread()`,
					// so there shouldn't be no "race conditions".
					UserData.updateTrackedThread(trackedThreadRecord)
					return true
				}
			}
		}
	}
}