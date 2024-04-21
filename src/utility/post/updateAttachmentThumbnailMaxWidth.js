import { getPostThumbnailSize } from 'social-components/post'

/**
 * Updates the current `attachmentThumbnailMaxWidth` from the new comments.
 * @param  {Post[]} posts
 * @param  {number} options.firstNewCommentIndex
 * @param  {number} [options.attachmentThumbnailMaxWidth]
 * @return {number} [attachmentThumbnailMaxWidth]
 */
export default function updateAttachmentThumbnailMaxWidth(posts, {
	firstNewCommentIndex = 0,
	attachmentThumbnailMaxWidth
} = {}) {
	if (typeof window !== 'undefined') {
		// Get attachment thumbnail size for setting
		// `--PostThumbnail-maxWidth--actual` CSS variable.
		// There can be very small pictures attached
		// so going through all attachments in all posts is required.
		let i = firstNewCommentIndex
		while (i < posts.length) {
			const post = posts[i]
			attachmentThumbnailMaxWidth = getAttachmentThumbnailMaxWidth(
				post,
				attachmentThumbnailMaxWidth
			)
			i++
		}
		// Set `--PostThumbnail-maxWidth--actual` CSS variable.
		if (attachmentThumbnailMaxWidth) {
			// Only update `--PostThumbnail-maxWidth--actual` CSS variable if it hasn't been set
			// or if the new value is bigger than the current one.
			// A default `--PostThumbnail-maxWidth--default` variable is always defined.
			const prevAttachmentThumbnailMaxWidth = parseInt(document.documentElement.style.getPropertyValue('--PostThumbnail-maxWidth--actual'))
			if (isNaN(prevAttachmentThumbnailMaxWidth) || prevAttachmentThumbnailMaxWidth < attachmentThumbnailMaxWidth) {
				// Overwrites the default value set on `<html/>`.
				document.documentElement.style.setProperty('--PostThumbnail-maxWidth--actual', attachmentThumbnailMaxWidth + 'px')
				/* Changing `--PostThumbnail-maxWidth` CSS variable will also change the main "flex" layout proportions. */
				/* So `--SidebarLeft-width` CSS variable should also be updated here because the Sidebar has adjusted its width. */
				const sidebarLeftElement = document.querySelector('.SidebarLeft')
				if (sidebarLeftElement) {
					document.documentElement.style.setProperty('--SidebarLeft-width', sidebarLeftElement.getBoundingClientRect().width + 'px')
				}
			}
			return attachmentThumbnailMaxWidth
		}
	}
}

function getAttachmentThumbnailMaxWidth(post, maxWidthSoFar) {
	function update(size) {
		if (maxWidthSoFar) {
			// maxWidthSoFar = Math.max(
			// 	maxWidthSoFar,
			// 	size.width,
			// 	size.height
			// )
			maxWidthSoFar = Math.max(maxWidthSoFar, size.width)
		} else {
			maxWidthSoFar = size.width
			// maxWidthSoFar = Math.max(
			// 	size.width,
			// 	size.height
			// )
		}
	}
	if (post.attachments) {
		for (const attachment of post.attachments) {
			const thumbnailSize = getPostThumbnailSize(attachment)
			if (thumbnailSize) {
				update(thumbnailSize)
			}
		}
	}
	return maxWidthSoFar
}