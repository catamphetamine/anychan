import Imageboard from './Imageboard'
import { getProvider } from '../provider'
import addCommentProps from './utility/addCommentProps'
import configuration from '../configuration'
import UserData from '../UserData/UserData'
import getMessages from './utility/getMessages'
import getCommentLengthLimit from '../utility/getCommentLengthLimit'

export default async function getThreads({
	channelId,
	censoredWords,
	grammarCorrection,
	messages,
	locale,
	http
}) {
	let threads
	let hasMoreThreads
	const provider = getProvider()
	if (provider.imageboard) {
		const imageboard = Imageboard({ messages, http })
		threads = await imageboard.getThreads({
			boardId: channelId
		}, {
			// The parser parses thread comments up to 4x faster without parsing their content.
			// Example: when parsing comments content — 650 ms, when not parsing comments content — 200 ms.
			parseContent: false,
			// Add `.parseContent()` function to each `comment`.
			addParseContent: true,
			commentLengthLimit: getCommentLengthLimit('channel')
		})
	} else {
		const result = await provider.api.getThreads({ channelId })
		threads = result.threads
		hasMoreChannels = result.hasMoreChannels
	}
	// Check the user's votes to mark some threads as "already voted"
	// for threads that the user has already voted for.
	const votesForThreads = UserData.getCommentVotes(channelId)
	for (const thread of threads) {
		addCommentProps(thread, {
			mode: 'channel',
			votes: votesForThreads[thread.id] || {},
			messages,
			locale,
			grammarCorrection,
			censoredWords
		})
		const comment = thread.comments[0]
		// Set `comment.channelId` for "is tracked thread" comment header badge.
		comment.channelId = channelId
	}
	// Return the threads.
	return threads
}