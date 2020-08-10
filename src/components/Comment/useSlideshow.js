import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import getSortedAttachments from 'social-components/commonjs/utility/post/getSortedAttachments'
import { isSlideSupported } from 'webapp-frontend/src/components/Slideshow'

import { openSlideshow } from 'webapp-frontend/src/redux/slideshow'

export default function useSlideshow({
	comment
}) {
	const dispatch = useDispatch()
	const onAttachmentClick = useCallback((attachment, options = {}) => {
		// Remove `spoiler: true` so that a once revealed spoiler isn't shown again
		// when "Show previous" button is clicked and `<PostAttachment/>` is
		// unmounted resulting in its `isRevealed: true` state property being reset.
		if (attachment.spoiler) {
			delete attachment.spoiler
		}
		// `<PostLink/>` doesn't provide `options` (and `thumbnailImage` as part of it).
		const { thumbnailImage } = options
		// The attachment clicked might be a `link` attachment
		// that's not part of `post.attachments` (that can be `undefined`).
		let attachments
		let i = -1
		if (comment.attachments) {
			attachments = getSortedAttachments(comment).filter(isSlideSupported)
			i = attachments.indexOf(attachment)
		}
		// If an attachment is either an uploaded one or an embedded one
		// then it will be in `post.attachments`.
		// If an attachment is only attached to a `link`
		// (for example, an inline-level YouTube video link)
		// then it won't be included in `post.attachments`.
		if (i >= 0) {
			dispatch(openSlideshow(attachments, i, { thumbnailImage }))
		} else {
			dispatch(openSlideshow([attachment], 0, { thumbnailImage }))
		}
	}, [
		comment,
		dispatch
	])
	return [
		onAttachmentClick
	]
}