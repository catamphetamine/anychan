import addCommentProps from './utility/addCommentProps.js'
import addThreadProps from './utility/addThreadProps.js'
import getCommentTextPreview from '../utility/comment/getCommentTextPreview.js'

export default async function getThreads({
	channelId,
	censoredWords,
	grammarCorrection,
	messages,
	locale,
	http,
	withLatestComments,
	sortByRating,
	userData,
	userSettings,
	dataSource
}) {
	const { threads, hasMoreThreads } = await dataSource.api.getThreads({
		channelId,
		withLatestComments,
		sortByRating,
		messages,
		http,
		userSettings,
		// `dataSourceId` parameter is used in `src/api/imageboard/getThreads.js`.
		dataSourceId: dataSource.id
	})

	const threadVotes = userData.getThreadVotes(channelId)
	const ownThreadIds = userData.getOwnThreads(channelId)
	const hiddenThreadIds = userData.getHiddenThreads(channelId)

	const ignoredAuthors = userData.getIgnoredAuthors()

	for (const thread of threads) {
		addThreadProps(thread, {
			locale,
			grammarCorrection,
			censoredWords
		})

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
				// Add `isFirstThreadInTheList` property on the first thread.
				// The property is used later to hide the separator line (via CSS)
				// above the first thread item in the list.
				threads[0].isFirstThreadInTheList = true
			}
		}

		// Check the user's votes to mark some threads as "already voted"
		// for threads that the user has already voted for.
		addCommentProps(thread, {
			mode: 'channel',
			votes: threadVotes ? (threadVotes[String(thread.id)] || {}) : {},
			ownCommentIds: ownThreadIds || [],
			hiddenCommentIds: hiddenThreadIds || [],
			ignoredAuthors: ignoredAuthors || {},
			// messages,
			locale,
			grammarCorrection,
			censoredWords,
			dataSource
		})

		const comment = thread.comments[0]

		// Add a function to generate text preview which is used in the Sidebar
		// to render thread preview.
		comment.createTextPreview = (function({
			charactersInLine,
			maxLines
		}) {
			// For some weird reason, using `comment` variable from outside this function
			// didn't work: it was always the comment of the last `thread` in the loop.
			// Perhaps it has something to do with the "closure" thing in Javascript.
			const comment = this
			if (!comment.textPreviewForSidebarCreated) {
				comment.parseContent()
				let decreaseCharacterLimitBy = 0
				if (comment.titleCensored) {
					// There's an empty line between the thread's title and thread's text preview.
					maxLines--
					decreaseCharacterLimitBy = Math.ceil(comment.titleCensored.length / charactersInLine) * charactersInLine
				}
				comment.textPreviewForSidebar = getCommentTextPreview(comment, {
					messages,
					decreaseCharacterLimitBy,
					charactersInLine,
					maxLines
				})
				comment.textPreviewForSidebarCreated = true
			}
		}).bind(comment)

		// Set `comment.channelId` for "is subscribed thread" comment header badge.
		comment.channelId = channelId
	}

	// Return the threads.
	return threads
}