import { useMemo, useCallback } from 'react'

import getPostThumbnailAttachment, { getPostThumbnailSize } from 'social-components/utility/post/getPostThumbnailAttachment.js'
import getPicturesAndVideos from 'social-components/utility/post/getPicturesAndVideos.js'
import getNonEmbeddedAttachments from 'social-components/utility/post/getNonEmbeddedAttachments.js'

export default function usePostThumbnail({
	comment,
	showPostThumbnailWhenThereAreMultipleAttachments,
	showPostThumbnailWhenThereIsNoContent,
	showOnlyFirstAttachmentThumbnail,
	expandAttachments,
	onAttachmentClick
}) {
	let postThumbnail = useMemo(() => {
		return getPostThumbnailAttachment(comment, {
			showPostThumbnailWhenThereAreMultipleAttachments,
			showPostThumbnailWhenThereIsNoContent
		})
	}, [
		comment,
		showPostThumbnailWhenThereAreMultipleAttachments,
		showPostThumbnailWhenThereIsNoContent
	])

	// React hooks don't allow `if`/`else`,
	// so this is a workaround.
	if (expandAttachments) {
		postThumbnail = undefined;
	}

	const postThumbnailOnClick = useCallback((event) => {
		if (onAttachmentClick) {
			onAttachmentClick(
				postThumbnail,
				{ imageElement: event.target }
			)
		}
	}, [
		postThumbnail
	])

	// The count of all attachments (only pictures and videos)
	// that aren't embedded in the post itself,
	// minus one for the "post thumbnail" itself.
	const postThumbnailMoreAttachmentsCount = useMemo(() => {
		if (postThumbnail && showOnlyFirstAttachmentThumbnail && comment.attachments.length > 1) {
			return getPicturesAndVideos(getNonEmbeddedAttachments(comment)).length - 1
		}
	}, [
		postThumbnail,
		showOnlyFirstAttachmentThumbnail,
		comment
	])

	const postThumbnailSize = postThumbnail && getPostThumbnailSize(postThumbnail)

	const postThumbnailSizeVarStyle = useMemo(() => {
		if (postThumbnailSize) {
			return {
				'--PostThumbnail-width': postThumbnailSize.width + 'px'
			}
		}
	}, [
		postThumbnailSize
	])

	return {
		postThumbnail,
		postThumbnailMoreAttachmentsCount,
		postThumbnailOnClick,
		postThumbnailSizeVarStyle
	}
}