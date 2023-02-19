import { getProvider } from '../provider.js'
import getThreadFromImageboard from './getThreadFromImageboard.js'
import configuration from '../configuration.js'
import addCommentProps from './utility/addCommentProps.js'
import addThreadProps from './utility/addThreadProps.js'
import getCommentLengthLimit from '../utility/comment/getCommentLengthLimit.js'
import getCommentTextPreview from '../utility/comment/getCommentTextPreview.js'

// import getOwnCommentsIncludingOriginalComment from '../UserData/bulkGetters/getOwnCommentsIncludingOriginalComment.js';
// import getHiddenCommentsIncludingOriginalComment from '../UserData/bulkGetters/getHiddenCommentsIncludingOriginalComment.js';
// import getCommentVotesIncludingOriginalComment from '../UserData/bulkGetters/getCommentVotesIncludingOriginalComment.js';

export default async function getThread({
	channelId,
	threadId,
	archived,
	// `threadBeforeRefresh` could be passed when refreshing a thread.
	// `threadBeforeRefresh` feature isn't current used, though it
	// could potentially be used in some hypothetical future.
	// It would enable fetching only the "incremental" update
	// for the thread instead of fetching all of its comments.
	threadBeforeRefresh,
	// `afterCommentId`/`afterCommentsCount` feature isn't currently used,
	// though it could potentially be used in some hypothetical future.
	// It would enable fetching only the "incremental" update
	// for the thread instead of fetching all of its comments.
	afterCommentId,
	afterCommentsCount,
	grammarCorrection,
	censoredWords,
	messages,
	locale,
	http,
	proxyUrl,
	userData,
	userSettings
}) {
	// Automatically set `afterCommentId`/`afterCommentsCount` parameters
	// if `threadBeforeRefresh` parameter was passed.
	if (!afterCommentId) {
		if (threadBeforeRefresh) {
			const lastCommentBeforeRefresh = threadBeforeRefresh.comments[threadBeforeRefresh.comments.length - 1]
			afterCommentId = lastCommentBeforeRefresh.id
			afterCommentsCount = threadBeforeRefresh.length
		}
	}

	const provider = getProvider()

	let result
	if (provider.imageboard) {
		result = await getThreadFromImageboard({
			channelId,
			threadId,
			archived,
			afterCommentId,
			afterCommentsCount,
			messages,
			http,
			proxyUrl,
			userSettings
		})
	} else {
		result = await provider.api.getThread({
			channelId,
			threadId
		})
	}

	const { thread, hasMoreComments } = result

	// (this feature is not currently used)
	// `4chan.org` provides a "-tail" API for getting thread comments
	// that reduces the traffic for a little bit by only returning
	// the last 50 comments or so.
	// If that "-tail" API would've been used, `fromIndex` would point
	// to the index of the first "-tail" comment in the "old" (before refresh)
	// thread comments list.
	let fetchedCommentsFromIndex
	if (thread.afterCommentId) {
		const fetchedCommentsAfterIndex = thread.comments.findIndex(comment => comment.id === thread.afterCommentId)
		if (fetchedCommentsAfterIndex < 0) {
			throw new Error(`Comment #${thread.afterCommentId} not found in thread comments when refreshing the thread`)
		}
		fetchedCommentsFromIndex = fetchedCommentsAfterIndex + 1
	}

	addCommentProps(thread, {
		mode: 'thread',
		fromIndex: fetchedCommentsFromIndex,
		// Check the user's votes to mark some comments as "already voted"
		// for comments that the user has already voted for.
		// votes: getCommentVotesIncludingOriginalComment(channelId, threadId) || {},
		// ownCommentIds: getOwnCommentsIncludingOriginalComment(channelId, threadId) || [],
		// hiddenCommentIds: getHiddenCommentsIncludingOriginalComment(channelId, threadId) || [],
		votes: userData.getCommentVotes(channelId, threadId) || {},
		ownCommentIds: userData.getOwnComments(channelId, threadId) || [],
		hiddenCommentIds: userData.getHiddenComments(channelId, threadId) || [],
		ignoredAuthors: userData.getIgnoredAuthors() || [],
		hasAuthorIds: threadBeforeRefresh && threadBeforeRefresh.hasAuthorIds,
		// onHasAuthorIds,
		// messages,
		locale,
		grammarCorrection,
		censoredWords
	})

	// If it's not an "incremental" fetch.
	if (fetchedCommentsFromIndex === undefined) {
		// The "opening" post of a thread is always parsed
		// when showing thread page because it's always immediately visible
		// and also because `title` is autogenerated from it.
		thread.comments[0].parseContent()

		// Add `thread` properties.
		addThreadProps(thread, {
			locale,
			grammarCorrection,
			censoredWords
		})

		// Generate text preview which is used for `<meta description/>` on the thread page.
		thread.comments[0].textPreviewForPageDescription = getCommentTextPreview(thread.comments[0], {
			messages,
			characterLimit: 160
		})

		// Return the thread.
		return thread
	}

	// If it is an "incremental" fetch.

	// If `threadHasAuthorIds` flag wasn't set on `threadBeforeRefresh.comments`
	// but it is set on `thread.comments`, then set it on `threadBeforeRefresh.comments`.
	if (!threadBeforeRefresh.hasAuthorIds) {
		if (thread.comments[0].threadHasAuthorIds) {
			threadBeforeRefresh.hasAuthorIds = true
			for (const comment of threadBeforeRefresh.comments) {
				comment.threadHasAuthorIds = true
			}
		}
	}

	return {
		...threadBeforeRefresh,
		...getThreadPropertiesFromIncrementalUpdate(thread)
	}
}

// `4chan.org` provides all of these properties in an "incremental" thread update.
const INCREMENTAL_THREAD_UPDATE_PROPERTIES = [
	// Is "bump limit" reached?
	'bumpLimitReached',

	// Is "image limit" reached?
	'attachmentLimitReached',

	// Total comments count in the thread,
	// not including the "main" ("original") comment.
	'commentsCount',

	// Total attachments count in the thread.
	'attachmentsCount',

	// The attachments count in comments of the thread.
	// Doesn't include the attachments in the Original Post of the thread.
	'commentAttachmentsCount',

	// Unique poster IPs count.
	'uniquePostersCount',

	// Is the thread locked?
	'locked',

	// Is the thread archived?
	'archived',

	// Is the thread pinned?
	'onTop'
]

function getThreadPropertiesFromIncrementalUpdate(thread) {
	const properties = {}

	// `4chan.org` provides all of the listed properties in an "incremental" thread update.
	// There could hypothetically exist some other unknown `4chan`-alike engine that
	// wouldn't provide the same list of properties, so added an `!== undefined` check.
	for (const property of INCREMENTAL_THREAD_UPDATE_PROPERTIES) {
		if (thread[property] !== undefined) {
			properties[property] = thread[property]
		}
	}

	return properties
}