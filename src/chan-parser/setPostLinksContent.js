import visitPostParts from 'webapp-frontend/src/utility/post/visitPostParts'

/**
 * Sets up post links.
 * @param {object[]} posts
 * @param {object} options
 */
export default function setPostLinksContent(post, { messages }) {
	visitPostParts(
		'post-link',
		postLink => postLink.content = getPostLinkContent(postLink, messages),
		post.content
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