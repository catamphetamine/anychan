import visitPostParts from 'webapp-frontend/src/utility/post/visitPostParts'

/**
 * Sets `content` for `{ type: 'post-link' }` parts.
 * For example, if a linked post was deleted then `content`
 * is set to "Deleted message" and if the message is hidden
 * then `content` is set to "Hidden message".
 * @param {any} content — Post `content`
 * @param {object} options
 */
export default function setPostLinksContent(content, { messages }) {
	visitPostParts(
		'post-link',
		postLink => postLink.content = getPostLinkContent(postLink, messages),
		content
	)
}

function getPostLinkContent(postLink, messages) {
	if (postLink.postWasDeleted) {
		return messages.deletedPost
	}
	if (postLink.postIsHidden) {
		if (postLink.postIsHiddenRule) {
			return `${messages.hiddenPost} (${postLink.postIsHiddenRule})`
		}
		return messages.hiddenPost
	}
	// No change.
	return postLink.content
}