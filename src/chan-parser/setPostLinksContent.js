import { findPostLinks } from './setPostLinkUrls'

/**
 * Sets up post links.
 * @param {object[]} posts
 * @param {object} options
 */
export default function setPostLinksContent(post, { messages }) {
	if (!post.content) {
		return
	}
	for (const postLink of findPostLinks(post.content)) {
		// Set content.
		postLink.content = getPostLinkContent(postLink, messages)
	}
}

export function getPostLinkContent(postLink, messages) {
	if (postLink.postWasDeleted) {
		return messages.deletedPost
	}
	if (postLink.postIsHidden) {
		return messages.hiddenPost
	}
	// No change.
	return postLink.content
}