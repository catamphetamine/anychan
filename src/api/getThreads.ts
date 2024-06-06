import type { GetThreadsParameters, DataSource, UserData, UserSettings, UserSettingsJson, Messages, Thread, ThreadFromDataSource, CommentFromDataSource, Comment, ChannelFromDataSource } from '../types/index.js'

import addCommentProps from './utility/addCommentProps.js'
import addThreadProps from './utility/addThreadProps.js'
import convertCommentContentToContentBlocks from './utility/convertCommentContentToContentBlocks.js'
import setDerivedThreadProps from './utility/setDerivedThreadProps.js'
import getCommentTextPreview from '../utility/comment/getCommentTextPreview.js'

import getProxyUrl from './utility/getProxyUrl.js'

export default async function getThreads({
	channelId,
	channelLayout,
	withLatestComments,
	sortBy,
	censoredWords,
	grammarCorrection,
	locale,
	messages,
	originalDomain,
	userData,
	userSettings,
	dataSource
}: Omit<GetThreadsParameters, 'dataSourceId' | 'proxyUrl'> & {
	grammarCorrection: UserSettingsJson['grammarCorrection'];
	censoredWords: UserSettingsJson['censoredWords'];
	locale: UserSettingsJson['locale'];
	messages: Messages,
	originalDomain?: string;
	userData: UserData,
	userSettings: UserSettings,
	dataSource: DataSource
}): Promise<{
	threads: Thread[],
	channel: ChannelFromDataSource,
	hasMoreThreads: boolean
}> {
	const {
		threads,
		hasMoreThreads,
		channel
	} = await dataSource.api.getThreads({
		channelId,
		channelLayout,
		withLatestComments,
		sortBy,
		// `dataSourceId` parameter is used in `src/api/imageboard/getThreads.js`.
		dataSourceId: dataSource.id,
		locale,
		originalDomain,
		proxyUrl: getProxyUrl({ dataSource, userSettings })
	})

	const threadVotes = userData.getThreadVotes(channelId)
	const ownThreadIds = userData.getOwnThreads(channelId)
	const hiddenThreadIds = userData.getHiddenThreads(channelId)

	const ignoredAuthors = userData.getIgnoredAuthors()

	// `threads` elements will be "deeply" modified by `addThreadProps()` and `addCommentProps()`
	// and when converting comments' `content`.

	for (const thread of threads) {
		// The `content` of each `comment` should be forcefully converted to a list of `ContentBlock`s.
		// The rationale is that it's easier to operate on (i.e. post-process) a single pre-defined type of structure
		// rather than support different edge cases like `content` being just a `string`.
		convertCommentContentToContentBlocks(thread)

		// Add some thread-specific "info" properties on the `comments` of the `thread`.
		addThreadProps(thread, {
			locale,
			grammarCorrection,
			censoredWords
		})

		// Set properties such as `thread.commentAttachmentsCount`.
		setDerivedThreadProps(thread)

		// Ensure that `.latestComments` property is defined on each `thread`
		// when `withLatestComments` mode is used.
		// The rationale is that `thread.latestComments` is used in other places
		// in this code to derive the `withLatestComments` flag value from it,
		// so it should either exist on all `thread`s or not exist on all `thread`s.
		if (withLatestComments) {
			if (!thread.latestComments) {
				thread.latestComments = []
			}

			if (thread === threads[0]) {
				// Added this assignment in order to work around TypeScript type errors.
				// It will add some properties specific to `anychan` Thread.
				const thread_ = thread as ThreadFromDataSource & Partial<Thread>

				// Add `isFirstThreadInTheList` property on the first thread.
				// The property is used later to hide the separator line (via CSS)
				// above the first thread item in the list.
				thread_.isFirstThreadInTheList = true
			}
		}

		// Check the user's votes to mark some threads as "already voted"
		// for threads that the user has already voted for.
		addCommentProps(thread, {
			mode: 'channel',
			channelLayout,
			votes: threadVotes ? (threadVotes[String(thread.id)] || {}) : {},
			ownCommentIds: ownThreadIds,
			hiddenCommentIds: hiddenThreadIds,
			ignoredAuthors: ignoredAuthors,
			messages,
			locale,
			grammarCorrection,
			censoredWords,
			dataSource
		})

		const comment = thread.comments[0] as CommentFromDataSource & Partial<Comment>

		// Add a function to generate text preview which is used in the Sidebar
		// to render thread preview.
		comment.createTextPreviewForSidebar = (function({
			charactersInLine,
			charactersInLastLine,
			maxLines
		}: {
			charactersInLine?: number,
			charactersInLastLine?: number,
			maxLines?: number
		}) {
			// For some weird reason, using `comment` variable from outside this function
			// didn't work: it was always the comment of the last `thread` in the loop.
			// Perhaps it has something to do with the "closure" thing in Javascript.
			const comment = this
			if (!comment.textPreviewForSidebarCreated) {
				comment.parseContent()
				let decreaseCharacterLimitBy = 0
				if (comment.titleCensored) {
					// There's an empty line between the thread's title and thread's text preview
					// when thread card is rendered in sidebar. Because of that, if the thread has a title,
					// the amount of available lines for the text should be decreased by 1.
					maxLines--
					decreaseCharacterLimitBy = Math.ceil(comment.titleCensored.length / charactersInLine) * charactersInLine
				}
				comment.textPreviewForSidebar = getCommentTextPreview(comment, {
					messages,
					decreaseCharacterLimitBy,
					charactersInLine,
					charactersInLastLine,
					maxLines
				})
				comment.textPreviewForSidebarCreated = true
			}
		}).bind(comment)

		// Set `comment.channelId` for "is subscribed thread" comment header badge.
		comment.channelId = channelId
	}

	// Added this assignment to fix TypeScript error.
	const threads_ = threads as Thread[]

	// Return the threads.
	return {
		threads: threads_,
		hasMoreThreads,
		channel
	}
}