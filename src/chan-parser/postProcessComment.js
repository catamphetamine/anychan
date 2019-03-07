import expandStandaloneAttachmentLinks from 'webapp-frontend/src/utility/post/expandStandaloneAttachmentLinks'
import removeNewLineCharacters from './removeNewLineCharacters'
import setPostLinkUrls from './setPostLinkUrls'
import parseLinks from './parseLinks'

export default function postProcessComment(comment, {
	boardId,
	threadId,
	messages
}) {
	parseLinks(comment)
	removeNewLineCharacters(comment)
	setPostLinkUrls(comment, { boardId, threadId, messages })
	expandStandaloneAttachmentLinks(comment)
}