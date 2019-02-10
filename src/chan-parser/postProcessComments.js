import generateTextPreview from './generateTextPreview'
import setInReplyToQuotes from './setInReplyToQuotes'
import setPostLinksContent from './setPostLinksContent'
import setReplies from './setReplies'

export default function postProcessComments(comments, { threadId, messages }) {
	// Text preview is used for `<meta description/>`.
	generateTextPreview(comments[0])
	// Autogenerate "in reply to" quotes.
	// Set `post-link`s' text.
	for (const comment of comments) {
		setInReplyToQuotes(comment.content, comments, { threadId, messages })
		setPostLinksContent(comment, { messages })
	}
	// Set `.replies` array for each comment.
	// `.replies` array has other comment IDs.
	setReplies(comments)
}