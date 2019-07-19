import visitPostParts from 'webapp-frontend/src/utility/post/visitPostParts'

/**
 * Sets `content` for `{ type: 'post-link' }` parts.
 * For example, if a linked post was deleted then `content`
 * is set to "Deleted message" and if the message is hidden
 * then `content` is set to "Hidden message".
 * @param {any} content — Post `content`
 * @param {object} options
 * @return {boolean} [contentDidChange] — Returns `true` if any "Deleted message"/"Hidden message" link text was set.
 */
export default function setPostLinksContent(content, { messages }) {
	const results = visitPostParts(
		'post-link',
		postLink => postLink.content = getPostLinkContent(postLink, messages),
		content
	)
	return results.length > 0
}

function getPostLinkContent(postLink, messages) {
	if (postLink.postWasDeleted) {
		return messages.deletedComment
	}
	if (postLink.postIsHidden) {
		if (postLink.postIsHiddenRule) {
			return `${messages.hiddenComment} (${postLink.postIsHiddenRule})`
		}
		return messages.hiddenComment
	}
	// No change.
	return postLink.content
}