import { useMemo, useCallback } from 'react'

import getPostThumbnailAttachment, { getPostThumbnailSize } from 'social-components/commonjs/utility/post/getPostThumbnailAttachment'
import getPicturesAndVideos from 'social-components/commonjs/utility/post/getPicturesAndVideos'
import getNonEmbeddedAttachments from 'social-components/commonjs/utility/post/getNonEmbeddedAttachments'

export default function usePostThumbnail({
	comment,
	mode,
	showPostThumbnailWhenThereAreMultipleAttachments,
	showPostThumbnailWhenThereIsNoContent,
	expandAttachments,
	hidden,
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
	if (hidden) {
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
		if (postThumbnail && mode === 'channel' && comment.attachments.length > 1) {
			return getPicturesAndVideos(getNonEmbeddedAttachments(comment)).length - 1
		}
	}, [
		postThumbnail,
		mode,
		comment
	])
	const postThumbnailSize = postThumbnail && getPostThumbnailSize(postThumbnail)
	const postThumbnailSizeStyle = useMemo(() => {
		if (postThumbnailSize) {
			return {
				'--PostThumbnail-width': postThumbnailSize.width + 'px'
			}
		}
	}, [
		postThumbnailSize
	])
	return [
		postThumbnail,
		postThumbnailMoreAttachmentsCount,
		postThumbnailOnClick,
		postThumbnailSizeStyle
	]
}