import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { isSlideSupported } from 'social-components-react/components/Slideshow.js'

import { openSlideshow } from '../../redux/slideshow.js'

import getSortedAttachments from 'social-components/utility/post/getSortedAttachments.js'

export default function useSlideshow({
	comment
}) {
	const dispatch = useDispatch()
	// `<PostLink/>` doesn't provide the `options` argument
	// (and `imageElement` as part of it) when calling `onAttachmentClick()`.
	const onAttachmentClick = useCallback((attachment, { imageElement, attachments } = {}) => {
		// Remove `spoiler: true` so that a once revealed spoiler isn't shown again
		// when "Show previous" button is clicked and `<PostAttachment/>` is
		// unmounted resulting in its `isRevealed: true` state property being reset.
		if (attachment.spoiler) {
			delete attachment.spoiler
		}
		// Determine the "show from" attachment index.
		// The attachment clicked might be a `link` attachment
		// that is not part of `post.attachments`,
		// in which case it will open slideshow in "exclusive" mode
		// with just that single attachment.
		if (!attachments) {
			if (comment.attachments) {
				attachments = getSortedAttachments(comment).filter(isSlideSupported)
			}
		}
		let i = -1
		if (attachments) {
			i = attachments.indexOf(attachment)
		}
		// If an attachment is part of `post.attachments`,
		// the open slideshow in the classic "slideshow" mode
		// where a user can swipe through all attachments.
		if (i >= 0) {
			dispatch(openSlideshow(attachments, i, { imageElement }))
		} else {
			// If an attachment is not part of `post.attachments`
			// (for example, an inline-level YouTube video link)
			// then open slideshow in "exclusive" mode with just that attachment.
			dispatch(openSlideshow([attachment], 0, { imageElement }))
		}
	}, [
		comment,
		dispatch
	])
	return [
		onAttachmentClick
	]
}