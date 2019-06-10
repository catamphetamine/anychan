import expandStandaloneAttachmentLinks from 'webapp-frontend/src/utility/post/expandStandaloneAttachmentLinks'
// import combineQuotes from 'webapp-frontend/src/utility/post/combineQuotes'
import removeNewLineCharacters from './removeNewLineCharacters'
import setPostLinkUrls from './setPostLinkUrls'
import parseLinksInText from './parseLinksInText'

export default function postProcessCommentContent(content, {
	// `comment` is only used by `expandStandaloneAttachmentLinks()`.
	comment,
	boardId,
	threadId,
	messages,
	getUrl
}) {
	// Finds all plain-text URLs in post `content`
	// and converts them to `{ type: 'link' }` objects.
	parseLinksInText(content)
	// Sometimes chan messages HTML contains things like "\\n" or "\\r\\n".
	removeNewLineCharacters(content)
	// It looks better without combining consequtive quote lines.
	// // Combine `{ type: 'inline-quote' }` objects on consequtive lines
	// // into a single `{ type: 'inline-quote' }` object with "\n"s inside.
	// combineQuotes(content)
	// Set `content`, `url`, `threadId` and `boardId` of `{ type: 'post-link' }` objects.
	setPostLinkUrls(content, { boardId, threadId, messages, getUrl })
	// Expand attachment links (objects of shape `{ type: 'link', attachment: ... }`)
	// into standalone attachments (block-level attachments: `{ type: 'attachment' }`).
	// In such case attachments are moved from `{ type: 'link' }` objects to `post.attachments`.
	expandStandaloneAttachmentLinks(comment)
}