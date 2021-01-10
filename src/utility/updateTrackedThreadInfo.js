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
	const commentsCount = thread.comments.length
	// In "get thread comments" API response, full thread info is available.
	if (hasFullThreadInfo) {
		// Update tracked thread info if there're any new comments.
		const latestComment = thread.comments[commentsCount - 1]
		const hasNewComments = latestComment.id !== trackedThreadRecord.latestComment.id
		if (hasNewComments) {
			trackedThreadRecord.latestComment = createTrackedThreadRecordLatestComment(latestComment, {
				isRolling: thread.isRolling
			})
			if (!thread.isRolling) {
				trackedThreadRecord.commentsCount = commentsCount
			}
		}
		// Update `refreshedAt` timestamp.
		trackedThreadRecord.refreshedAt = Date.now()
		// Update tracked thread record.
		// This code is executed synchronously after `UserData.isTrackedThread()`,
		// so there shouldn't be no "race conditions".
		UserData.updateTrackedThread(trackedThreadRecord)
		return hasNewComments
	} else {
		// Don't update `refreshedAt` timestamp because it's not a proper refresh.
		//
		// In `/catalog.json` API response, there're no thread comments.
		// (only the first ("original") comment is present).
		// Still can use the total comments count though.
		//
		// "Rolling" threads are excluded because older comments in them
		// get erased naturally.
		//
		if (!thread.isRolling) {
			// New comments count could be less than the old comments count
			// in cases when some comments got deleted.
			// New comments count could be equal to the old comments count
			// doesn't imply that there're no new comments: there could be
			// some new comments, with some older comments that got deleted.
			// So, comments count is not an "exhaustive" criterion of a thread
			// having new comments, but for most cases it is.
			if (commentsCount !== trackedThreadRecord.commentsCount) {
				console.log(`Comments count changed for thread /${thread.channelId}/${thread.id} from ${trackedThreadRecord.commentsCount} to ${commentsCount} (from "catalog" response).`)
				// Don't re-generate the whole tracked thread info, because, for example,
				// `lynxchan` doesn't provide full thread info in `/catalog.json`
				// API response, and this function gets called on `/catalog.json`
				// API response.
				trackedThreadRecord.commentsCount = commentsCount
				// Update tracked thread record.
				// This code is executed synchronously after `UserData.isTrackedThread()`,
				// so there shouldn't be no "race conditions".
				UserData.updateTrackedThread(trackedThreadRecord)
				return true
			}
		}
	}
}