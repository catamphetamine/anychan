import { useRef, useMemo } from 'react'

import { updateAttachmentThumbnailMaxWidth } from '../../utility/postThumbnail'

export default function useUpdateAttachmentThumbnailMaxWidth({
	comments
}) {
	const attachmentThumbnailMaxWidth = useRef()
	const prevCommentsCount = useRef()
	// Runs only once before the initial render.
	// Sets `--PostThumbnail-maxWidth` CSS variable.
	useMemo(
		() => {
			attachmentThumbnailMaxWidth.current = updateAttachmentThumbnailMaxWidth(
				comments,
				{
					firstNewCommentIndex: prevCommentsCount.current,
					attachmentThumbnailMaxWidth: attachmentThumbnailMaxWidth.current
				}
			)
			prevCommentsCount.current = comments.length
		},
		// Update on new comments.
		// `thread.comments[]` changes on every auto-update,
		// regardless of whether there're any new comments,
		// so the dependency is `comments.length` instead of `comments`.
		[comments.length]
	)
}