import Imageboard from './Imageboard.js'
import { getProvider } from '../provider.js'
import addCommentProps from './utility/addCommentProps.js'
import addThreadProps from './utility/addThreadProps.js'
import configuration from '../configuration.js'
import getUserData from '../UserData.js'
import getCommentLengthLimit from '../utility/comment/getCommentLengthLimit.js'

const MAX_LATEST_COMMENTS_PAGES_COUNT = 2

export default async function getThreads({
	channelId,
	censoredWords,
	grammarCorrection,
	messages,
	locale,
	http,
	proxyUrl,
	withLatestComments,
	sortByRating,
	userData = getUserData()
}) {
	let threads
	let hasMoreThreads

	const provider = getProvider()
	if (provider.imageboard) {
		const imageboard = Imageboard({ messages, http, proxyUrl })
		threads = await imageboard.getThreads({
			boardId: channelId
		}, {
			// The parser parses thread comments up to 4x faster without parsing their content.
			// Example: when parsing comments content — 650 ms, when not parsing comments content — 200 ms.
			parseContent: false,
			// Add `.parseContent()` function to each `comment`.
			addParseContent: true,
			commentLengthLimit: getCommentLengthLimit('channel'),
			latestCommentLengthLimit: getCommentLengthLimit('thread'),
			maxLatestCommentsPages: withLatestComments ? MAX_LATEST_COMMENTS_PAGES_COUNT : undefined,
			withLatestComments,
			sortByRating
		})
		if (withLatestComments) {
			for (const thread of threads) {

			}
		}
	} else {
		const result = await provider.api.getThreads({ channelId })
		threads = result.threads
		hasMoreChannels = result.hasMoreChannels
	}

	const threadVotes = userData.getThreadVotes(channelId)
	const ownThreads = userData.getOwnThreads(channelId)
	const hiddenThreads = userData.getHiddenThreads(channelId)

	// Don't show hidden threads.
	if (hiddenThreads) {
		threads = threads.filter(thread => !hiddenThreads.includes(thread.id))
	}

	const ignoredAuthors = userData.getIgnoredAuthors()

	// Check the user's votes to mark some threads as "already voted"
	// for threads that the user has already voted for.
	for (const thread of threads) {
		addThreadProps(thread, {
			locale,
			grammarCorrection,
			censoredWords
		})
		addCommentProps(thread, {
			mode: 'channel',
			votes: threadVotes ? (threadVotes[String(thread.id)] || {}) : {},
			own: ownThreads ? ownThreads.filter(id => id === threadId) : [],
			hidden: [],
			ignoredAuthors: ignoredAuthors || {},
			// messages,
			locale,
			grammarCorrection,
			censoredWords
		})
		const comment = thread.comments[0]
		// Set `comment.channelId` for "is subscribed thread" comment header badge.
		comment.channelId = channelId
	}

	// Return the threads.
	return threads
}