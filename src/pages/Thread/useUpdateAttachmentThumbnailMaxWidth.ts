import type { Comment } from '@/types'

import { useRef, useMemo } from 'react'

import updateAttachmentThumbnailMaxWidth from '../../utility/post/updateAttachmentThumbnailMaxWidth.js'

export default function useUpdateAttachmentThumbnailMaxWidth({ comments }: { comments: Comment[] }) {
	const attachmentThumbnailMaxWidth = useRef<number>()
	const prevCommentsCount = useRef<number>()

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