import createByIdIndex from '../utility/createByIdIndex'

/**
 * Removes the references to threads that have expired.
 * @param  {string} channelId
 * @param  {object[]} threads
 * @param  {boolean} [options.threadArchive] — Whether the provider archives threads.
 * @param  {number} [options.threadArchiveLifetime] — Archived threads "time to live", in milliseconds.
 * @return {string[]} Returns updated collections' names.
 */
export default function onThreadsList(channelId, threads, {
	timer = new Timer(),
	userData,
	threadArchive,
	threadArchiveLifetime
}) {
	const getThreadById = createByIdIndex(threads)
	// A cache is used here, because `hasThreadExpired()` removes
	// "archived thread" records, so if it wasn't cached, then
	// it would produce different results on subsequent runs.
	const hasThreadExpiredCache = {}
	/**
	 * Checks whether a thread has expired.
	 * @param  {string}  threadId
	 * @return {boolean}
	 */
	const hasThreadExpiredCached = (threadId) => {
		if (hasThreadExpiredCache[threadId] === undefined) {
			hasThreadExpiredCache[threadId] = hasThreadExpired(
				channelId,
				threadId,
				getThreadById,
				{
					timer,
					userData,
					threadArchive,
					threadArchiveLifetime
				}
			)
			if (hasThreadExpiredCache[threadId]) {
				console.log(`Thread expired: /${channelId}/${threadId}`)
			}
		}
		return hasThreadExpiredCache[threadId]
	}
	// A cache is used here, because `hasThreadExpired()` removes
	// "archived thread" records, so if it wasn't cached, then
	// it would produce different results on subsequent runs.
	const hasThreadBeenArchivedCache = {}
	/**
	 * Checks whether a thread has been archived.
	 * @param  {string}  threadId
	 * @return {boolean}
	 */
	const hasThreadBeenArchivedCached = (threadId) => {
		if (hasThreadBeenArchivedCache[threadId] === undefined) {
			hasThreadBeenArchivedCache[threadId] = hasThreadBeenArchived(
				channelId,
				threadId,
				getThreadById,
				{
					timer,
					userData,
					threadArchive,
					threadArchiveLifetime
				}
			)
			if (hasThreadBeenArchivedCache[threadId]) {
				console.log(`Thread archived: /${channelId}/${threadId}`)
			}
		}
		return hasThreadBeenArchivedCache[threadId]
	}
	// Clear expired or archived threads data from `UserData`.
	return userData.onThreadsArchivedOrExpired({
		channelId,
		timer,
		// `hasExpired()` has a side effect:
		// in some cases it creates an "archived thread" record for non-found threads.
		// Therefore, it should not be called for `expired: true` records of
		// `clearOnExpire: false` collections.
		hasExpired(threadId) {
			return hasThreadExpiredCached(threadId)
		},
		isArchived(threadId) {
			if (threadArchive) {
				return hasThreadBeenArchivedCached(threadId)
			}
		},
		// getArchivedAt(threadId) {
		// 	// Archived threads are not present in the list of threads of the channel,
		// 	// so their archival date is not known.
		// 	return undefined
		// }
	})
}

/**
 * Checks whether a thread has expired.
 * This function has a side effect:
 * in some cases it calls `onArchivedThreadRecordNotFoundForReferencedThread()`
 * for non-found threads. Therefore, this function should not be called
 * for `expired: true` records of `clearOnExpire: false` collections.
 * @param  {string}  channelId
 * @param  {string}  threadId
 * @param  {function}  getThreadById
 * @param  {function}  onArchivedThreadExpired — Should be called on threads that have previosly been archived and have now expired.
 * @param  {function}  onArchivedThreadRecordNotFoundForReferencedThread — Should be called on threads that are still referenced from UserData (excluding `expired: true` records of `clearOnExpire: false` collections) but weren't found in the list of thread of the channel.
 * @param  {number}  options.now — The current timestamp, so that the results are consistent throughout the `onThreadsArchivedOrExpired()` function call.
 * @param  {boolean}  [options.threadArchive] — Whether the provider archives threads.
 * @param  {number}  [options.threadArchiveLifetime] — Archived threads "time to live", in milliseconds.
 * @return {boolean}
 */
function hasThreadExpired(
	channelId,
	threadId,
	getThreadById,
	{
		timer,
		userData,
		threadArchive,
		threadArchiveLifetime
	}
) {
	const thread = getThreadById(threadId)
	if (thread) {
		return false
	}
	// At this point, it is known that a thread is no longer present
	// in the channel's list of threads
	if (!threadArchive) {
		return true
	}
	if (threadArchiveLifetime === undefined) {
		return false
	}
	// If `threadArchiveLifetime` is defined for an imageboard,
	// then start a countdown of the in-archive lifetime of the thread
	// when it's first detected to be archived.
	const archivedThreadAccessedAt = userData.getArchivedThreadAccessedAt(channelId, threadId)
	if (archivedThreadAccessedAt) {
		// If the "archived thread" record exists, then check whether this
		// archived thread has expired.
		if (timer.now() > archivedThreadAccessedAt.getTime() + threadArchiveLifetime) {
			// Expired.
			return true
		}
		// Hasn't expired yet.
		return false
	}
	// Will create an `archivedThreadAccessedAt` record for this thread.
	return false
}

/**
 * Checks whether a thread has been archived.
 * @param  {string}  channelId
 * @param  {string}  threadId
 * @param  {function} getThreadById
 * @param  {boolean}  [options.threadArchive] — Whether the provider archives threads.
 * @param  {number}  [options.threadArchiveLifetime] — Archived threads "time to live", in milliseconds.
 * @return {boolean}
 */
function hasThreadBeenArchived(channelId, threadId, getThreadById, {
	timer,
	userData,
	threadArchive,
	threadArchiveLifetime
}) {
	const thread = getThreadById(threadId)
	if (thread) {
		return false
	}
	// At this point, it is known that a thread is no longer present
	// in the channel's list of threads.
	if (!threadArchive) {
		return false
	}
	if (threadArchiveLifetime === undefined) {
		return true
	}
	// If `threadArchiveLifetime` is defined for an imageboard,
	// then start a countdown of the in-archive lifetime of the thread
	// when it's first detected to be archived.
	const archivedThreadAccessedAt = userData.archive.getArchivedThreadAccessedAt(channelId, threadId)
	if (archivedThreadAccessedAt) {
		// If the "archived thread" record exists, then check whether this
		// archived thread has expired.
		if (timer.now() > archivedThreadAccessedAt.getTime() + threadArchiveLifetime) {
			// Expired.
			return false
		}
		// Hasn't expired yet.
		return true
	}
	// Will create an `archivedThreadAccessedAt` record for this thread.
	return true
}