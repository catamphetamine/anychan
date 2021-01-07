import { getPostThumbnailSize } from 'social-components/commonjs/utility/post/getPostThumbnailAttachment'

const CSS_VARIABLE_NAME = '--PostThumbnail-maxWidth'

export function updateAttachmentThumbnailMaxSize(posts) {
	if (typeof window !== 'undefined') {
		// Get attachment thumbnail size for setting
		// `--PostThumbnail-maxWidth` CSS variable.
		// There can be very small pictures attached
		// so going through all attachments in all posts is required.
		let attachmentThumbnailMaxWidth
		for (const post of posts) {
			attachmentThumbnailMaxWidth = getAttachmentThumbnailMaxWidth(
				post,
				attachmentThumbnailMaxWidth
			)
		}
		// Set `--PostThumbnail-maxWidth` CSS variable.
		if (attachmentThumbnailMaxWidth) {
			// Only update `--PostThumbnail-maxWidth` CSS variable if it hasn't been set
			// or if the new value is bigger than the current one.
			const prevAttachmentThumbnailMaxWidth = parseInt(document.body.style.getPropertyValue(CSS_VARIABLE_NAME))
			if (isNaN(prevAttachmentThumbnailMaxWidth) || prevAttachmentThumbnailMaxWidth < attachmentThumbnailMaxWidth) {
				// Sets it on `<body/>` because there's a default value set on `<html/>`.
				document.body.style.setProperty(CSS_VARIABLE_NAME, attachmentThumbnailMaxWidth + 'px')
			}
		}
	}
}

function getAttachmentThumbnailMaxWidth(post, maxSizeSoFar) {
	function update(size) {
		if (maxSizeSoFar) {
			// maxSizeSoFar = Math.max(
			// 	maxSizeSoFar,
			// 	size.width,
			// 	size.height
			// )
			maxSizeSoFar = Math.max(maxSizeSoFar, size.width)
		} else {
			maxSizeSoFar = size.width
			// maxSizeSoFar = Math.max(
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
	return maxSizeSoFar
}