import getUserData from '../UserData.js'

// Combines thread vote and comment votes.
export default function getCommentVotesIncludingOriginalComment(channelId, threadId) {
	const threadVotes = getUserData().getThreadVotes(channelId)
	const commentVotes = getUserData().getCommentVotes(channelId, threadId)
	if (threadVotes) {
		const threadVote = threadVotes[String(threadId)]
		if (threadVote) {
			return {
				[String(threadId)]: threadVote,
				...commentVotes
			}
		}
	}
	return commentVotes
}