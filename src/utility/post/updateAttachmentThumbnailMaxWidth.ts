import { PictureSize } from 'imageboard'
import type { Post } from 'social-components'

import { getPostThumbnailSize } from 'social-components/post'
import { isVectorImage } from 'social-components/image'

/**
 * Updates the current `attachmentThumbnailMaxWidth` from the new comments.
 * @param  {Post[]} posts
 * @param  {number} options.firstNewCommentIndex
 * @param  {number} [options.attachmentThumbnailMaxWidth]
 * @return {number} [attachmentThumbnailMaxWidth]
 */
export default function updateAttachmentThumbnailMaxWidth(posts: Post[], {
	firstNewCommentIndex = 0,
	attachmentThumbnailMaxWidth
}: {
	firstNewCommentIndex?: number,
	attachmentThumbnailMaxWidth?: number
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

function getAttachmentThumbnailMaxWidth(post: Post, maxWidthSoFar: number | undefined) {
	function update(size: PictureSize) {
		// Vector images like `*.svg`s don't have a concept of an "actual size".
		const sizeWidth = isVectorImage(size) ? 0 : size.width
		if (maxWidthSoFar) {
			maxWidthSoFar = Math.max(maxWidthSoFar, sizeWidth)
		} else {
			maxWidthSoFar = sizeWidth
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