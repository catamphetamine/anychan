import setInReplyToQuotes from './setInReplyToQuotes'
import setPostLinksContent from './setPostLinksContent'
import setReplies from './setReplies'

export default function postProcessComments(comments, { threadId, messages }) {
	for (const comment of comments) {
		setInReplyToQuotes(comment.content, comments, { threadId, messages })
		setPostLinksContent(comment, { messages })
	}
	setReplies(comments)
}