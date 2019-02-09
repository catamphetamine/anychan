import expandStandaloneAttachmentLinks from './expandStandaloneAttachmentLinks'
import removeNewLineCharacters from './removeNewLineCharacters'
import setPostLinkUrls from './setPostLinkUrls'
import parseLinks from './parseLinks'
import parseYouTubeLinks from './parseYouTubeLinks'

export default async function postProcessComment(comment, {
	boardId,
	threadId,
	filters,
	messages,
	youTubeApiKey
}) {
	parseLinks(comment)
	removeNewLineCharacters(comment)
	setPostLinkUrls(comment, { boardId, threadId, messages })
	await parseYouTubeLinks(comment, { youTubeApiKey, messages })
	expandStandaloneAttachmentLinks(comment)
}