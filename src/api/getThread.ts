import type {
	Channel,
	Thread,
	ThreadFromDataSource,
	GetThreadParameters,
	Comment,
	CommentFromDataSource,
	Messages,
	UserData,
	UserSettings,
	UserSettingsJson,
	DataSource
} from '../types/index.js'

import addCommentProps from './utility/addCommentProps.js'
import addThreadProps from './utility/addThreadProps.js'
import convertCommentContentToContentBlocks from './utility/convertCommentContentToContentBlocks.js'
import setDerivedThreadProps from './utility/setDerivedThreadProps.js'
import getCommentTextPreview from '../utility/comment/getCommentTextPreview.js'
import setRepliesOnComments from '../utility/thread/setRepliesOnComments.js'

import getProxyUrl from './utility/getProxyUrl.js'

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
	// `afterCommentId`/`afterCommentNumber` feature isn't currently used,
	// though it could potentially be used in some hypothetical future.
	// It would enable fetching only the "incremental" update
	// for the thread instead of fetching all of its comments.
	afterCommentId,
	afterCommentNumber,
	grammarCorrection,
	censoredWords,
	locale,
	messages,
	originalDomain,
	userData,
	userSettings,
	dataSource
}: Omit<GetThreadParameters, 'proxyUrl'> & {
	grammarCorrection: UserSettingsJson['grammarCorrection'];
	censoredWords: UserSettingsJson['censoredWords'];
	locale: UserSettingsJson['locale'];
	messages: Messages;
	originalDomain?: string;
	userData: UserData;
	userSettings: UserSettings;
	dataSource: DataSource;
}): Promise<{
	thread: Thread,
	channel?: Channel,
	hasMoreComments?: boolean
}> {
	// Automatically set `afterCommentId`/`afterCommentNumber` parameters
	// if `threadBeforeRefresh` parameter was passed.
	if (!afterCommentId) {
		if (threadBeforeRefresh) {
			const lastCommentBeforeRefresh = threadBeforeRefresh.comments[threadBeforeRefresh.comments.length - 1]
			afterCommentId = lastCommentBeforeRefresh.id
			afterCommentNumber = threadBeforeRefresh.comments.length
		}
	}

	const {
		thread,
		hasMoreComments,
		channel
	} = await dataSource.api.getThread({
		channelId,
		threadId,
		archived,
		afterCommentId,
		afterCommentNumber,
		locale,
		originalDomain,
		proxyUrl: getProxyUrl({ dataSource, userSettings })
	})

	// The `thread` object will be "deeply" modified by `addThreadProps()`
	// and when converting comments' `content`.

	// The `content` of each `comment` should be forcefully converted to a list of `ContentBlock`s.
	// The rationale is that it's easier to operate on (i.e. post-process) a single pre-defined type of structure
	// rather than support different edge cases like `content` being just a `string`.
	convertCommentContentToContentBlocks(thread)

	// (this feature is not currently used)
	// `4chan.org` provides a "-tail" API for getting thread comments
	// that reduces the traffic for a little bit by only returning
	// the last 50 comments or so.
	// If that "-tail" API would've been used, `fromIndex` would point
	// to the index of the first "-tail" comment in the "old" (before refresh)
	// thread comments list.
	let fetchedCommentsFromIndex
	if (afterCommentId) {
		const fetchedCommentsAfterIndex = thread.comments.findIndex(comment => comment.id === afterCommentId)
		if (fetchedCommentsAfterIndex < 0) {
			throw new Error(`Comment #${afterCommentId} not found in thread comments when refreshing the thread`)
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
		ownCommentIds: userData.getOwnComments(channelId, threadId),
		hiddenCommentIds: userData.getHiddenComments(channelId, threadId),
		ignoredAuthors: userData.getIgnoredAuthors(),
		hasAuthorIds: threadBeforeRefresh && threadBeforeRefresh.hasAuthorIds,
		// onHasAuthorIds,
		messages,
		locale,
		grammarCorrection,
		censoredWords,
		dataSource
	})

	// If it's not an "incremental" fetch.
	if (fetchedCommentsFromIndex === undefined) {
		// The "opening" post of a thread is always parsed
		// when showing thread page because it's always immediately visible
		// and also because `title` is autogenerated from it.
		thread.comments[0].parseContent()

		// Add some thread-specific "info" properties on the `comments` of the `thread`.
		addThreadProps(thread, {
			locale,
			grammarCorrection,
			censoredWords
		})

		// Added this assignment in order to work around TypeScript type errors.
		// It will add some properties to `firstComment` that're specific to `anychan`.
		const firstComment = thread.comments[0] as CommentFromDataSource & Partial<Comment>

		// Generate text preview which is used for `<meta description/>` on the thread page.
		firstComment.textPreviewForPageDescription = getCommentTextPreview(thread.comments[0] as Comment, {
			messages,
			characterLimit: 160
		})

		// Added this assignment to fix TypeScript error.
		const thread_ = thread as Thread

		// Return the thread.
		return {
			thread: setRepliesOnComments(thread_),
			hasMoreComments,
			channel
		}
	}

	// If it is an "incremental" fetch.
	// This code hasn't been tested because currently the application doesn't use this scenario.
	// There is thread "Auto-Update" but it re-fetches the whole thread every time
	// and doesn't use `threadBeforeRefresh` or `afterCommentId` parameter.
	// So currently, this part of the function's code is "unreachable".

	// Set properties such as `thread.commentAttachmentsCount`.
	setDerivedThreadProps(thread)

	// If `threadHasAuthorIds` flag wasn't set on `threadBeforeRefresh.comments`
	// but it is set on `thread.comments`, then set it on `threadBeforeRefresh.comments`.
	if (!threadBeforeRefresh.hasAuthorIds) {
		// Added this assignment in order to work around TypeScript type errors.
		// `threadHasAuthorIds` property is specific to `anychan`.
		const firstComment = thread.comments[0] as CommentFromDataSource & Partial<Comment>
		if (firstComment.threadHasAuthorIds) {
			threadBeforeRefresh.hasAuthorIds = true
			for (const comment of threadBeforeRefresh.comments) {
				comment.threadHasAuthorIds = true
			}
		}
	}

	const thread_: Thread = {
		...threadBeforeRefresh,
		...getThreadPropertiesFromIncrementalUpdate(thread)
	}

	throw new Error('Here it should somehow merge `threadBeforeRefresh.comments` and `thread.comments`, and update `.replies[]`/`.inReplyTo[]` properties of each comment')
	// thread_.comments = ...

	return {
		thread: setRepliesOnComments(thread_),
		channel,
		hasMoreComments
	}
}

// `4chan.org` provides all of these properties in an "incremental" thread update.
const INCREMENTAL_THREAD_UPDATE_PROPERTIES: (keyof ThreadFromDataSource)[] = [
	// Is "bump limit" reached?
	'bumpLimitReached',

	// Is "image limit" reached?
	'attachmentLimitReached',

	// Total comments count in the thread,
	// not including the "main" ("original") comment.
	'commentsCount',

	// Total attachments count in the thread,
	// including the attachments in the "main" ("original") comment.
	'attachmentsCount',

	// Unique poster IPs count.
	'uniquePostersCount',

	// Is the thread locked?
	'locked',

	// Is the thread archived?
	'archived',

	// Is the thread pinned?
	'pinned',
	'pinnedOrder'
] as const

function getThreadPropertiesFromIncrementalUpdate(thread: ThreadFromDataSource) {
	const properties: Partial<Record<keyof ThreadFromDataSource, any>> = {}

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