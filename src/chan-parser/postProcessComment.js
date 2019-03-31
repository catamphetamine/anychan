import expandStandaloneAttachmentLinks from 'webapp-frontend/src/utility/post/expandStandaloneAttachmentLinks'
// import combineQuotes from 'webapp-frontend/src/utility/post/combineQuotes'
import removeNewLineCharacters from './removeNewLineCharacters'
import setPostLinkUrls from './setPostLinkUrls'
import parseLinks from './parseLinks'

export default function postProcessComment(comment, {
	boardId,
	threadId,
	messages,
	getUrl
}) {
	parseLinks(comment)
	removeNewLineCharacters(comment)
	// It looks better without combining consequtive quote lines.
	// combineQuotes(comment.content)
	setPostLinkUrls(comment, { boardId, threadId, messages, getUrl })
	expandStandaloneAttachmentLinks(comment)
}