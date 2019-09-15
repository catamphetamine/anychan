import Chan from './Chan'
import setThreadInfo from './utility/setThreadInfo'
import configuration from '../configuration'
import UserData from '../UserData/UserData'

import { generatePreview } from '../imageboard'

export default async function getThreads({
	boardId,
	censoredWords,
	messages,
	http
}) {
	const chan = Chan({ censoredWords, messages, http })
	const threads = await chan.getThreads({
		boardId
	}, {
		// The parser parses thread comments up to 4x faster without parsing their content.
		// Example: when parsing comments content — 650 ms, when not parsing comments content — 200 ms.
		parseContent: false
	})
	const votes = UserData.getCommentVotes(boardId)
	for (const thread of threads) {
		setThreadInfo(thread, {
			mode: 'thread',
			votes: votes[thread.id] || {}
		})
		const comment = thread.comments[0]
		comment.parseContent = () => {
			if (comment.content) {
				chan.parseCommentContent(comment, {
					boardId,
					threadId: thread.id
				})
				// Generate comment preview (for long comments).
				generatePreview(comment, configuration.commentLengthLimitForThreadPreview || configuration.commentLengthLimit)
				// `.parseContent()` method is set to a "no op" function
				// instead of `undefined` for convenience.
				// (because it can be called multiple times in case of a
				//  `virtual-scroller` with `initialState` being passed)
				comment.parseContent = () => {}
			}
		}
	}
	return {
		boardId,
		threads
	}
}