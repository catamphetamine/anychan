import { getPostThumbnailSize } from 'social-components/utility/post/getPostThumbnailAttachment.js'

const POST_THUMBNAIL_MAX_WIDTH_CSS_VARIABLE_NAME = '--PostThumbnail-maxWidth'

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
		// `--PostThumbnail-maxWidth` CSS variable.
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
		// Set `--PostThumbnail-maxWidth` CSS variable.
		if (attachmentThumbnailMaxWidth) {
			// Only update `--PostThumbnail-maxWidth` CSS variable if it hasn't been set
			// or if the new value is bigger than the current one.
			const prevAttachmentThumbnailMaxWidth = parseInt(document.body.style.getPropertyValue(POST_THUMBNAIL_MAX_WIDTH_CSS_VARIABLE_NAME))
			if (isNaN(prevAttachmentThumbnailMaxWidth) || prevAttachmentThumbnailMaxWidth < attachmentThumbnailMaxWidth) {
				// Sets it on `<body/>` because there's a default value set on `<html/>`.
				document.body.style.setProperty(POST_THUMBNAIL_MAX_WIDTH_CSS_VARIABLE_NAME, attachmentThumbnailMaxWidth + 'px')
				/* `--PostThumbnail-maxWidth` CSS variable influences the main "flex" layout proportions. */
				/* Because of that, `--SidebarLeft-width` CSS variable is also updated here. */
				const sidebarLeftElement = document.querySelector('.SidebarLeft')
				if (sidebarLeftElement) {
					document.body.style.setProperty('--SidebarLeft-width', sidebarLeftElement.getBoundingClientRect().width + 'px')
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