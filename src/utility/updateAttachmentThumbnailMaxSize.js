import { getPostThumbnailSize } from 'social-components/commonjs/utility/post/getPostThumbnail'

const CSS_VARIABLE_NAME = '--PostThumbnail-maxWidth'

export default function updateAttachmentThumbnailMaxSize(posts) {
	if (typeof window !== 'undefined') {
		// Get attachment thumbnail size for setting
		// `--PostThumbnail-maxWidth` CSS variable.
		// There can be very small pictures attached
		// so going through all attachments in all posts is required.
		let attachmentThumbnailSize
		for (const post of posts) {
			attachmentThumbnailSize = getAttachmentThumbnailMaxSize(
				post,
				attachmentThumbnailSize
			)
		}
		// Set `--PostThumbnail-maxWidth` CSS variable.
		if (attachmentThumbnailSize) {
			// Only update `--PostThumbnail-maxWidth` CSS variable if it hasn't been set
			// or if the new value is bigger than the current one.
			const prevAttachmentThumbnailSize = parseInt(document.body.style.getPropertyValue(CSS_VARIABLE_NAME))
			if (isNaN(prevAttachmentThumbnailSize) || prevAttachmentThumbnailSize < attachmentThumbnailSize) {
				// Sets it on `<body/>` because there's a default value set on `<html/>`.
				document.body.style.setProperty(CSS_VARIABLE_NAME, attachmentThumbnailSize + 'px')
			}
		}
	}
}

function getAttachmentThumbnailMaxSize(post, maxSizeSoFar) {
	function update(size) {
		if (maxSizeSoFar) {
			maxSizeSoFar = Math.max(
				maxSizeSoFar,
				size.width,
				size.height
			)
		} else {
			maxSizeSoFar = Math.max(
				size.width,
				size.height
			)
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