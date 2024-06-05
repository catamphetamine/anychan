import type { Comment, onAttachmentClick } from "@/types"

import { useMemo, useCallback } from 'react'

import {
	getPostThumbnailAttachment,
	getPostThumbnailSize,
	getNonEmbeddedAttachments
} from 'social-components/post'

import {
	getPicturesAndVideos
} from 'social-components/attachment'
import { Attachment } from "social-components"
import { isVectorImage } from "social-components/image"

export default function usePostThumbnail({
	comment,
	showPostThumbnailWhenThereAreMultipleAttachments,
	showPostThumbnailWhenThereIsNoContent,
	showOnlyFirstAttachmentThumbnail,
	expandAttachments,
	onAttachmentClick
}: {
	comment: Comment,
	showPostThumbnailWhenThereAreMultipleAttachments?: boolean,
	showPostThumbnailWhenThereIsNoContent?: boolean,
	showOnlyFirstAttachmentThumbnail?: boolean,
	expandAttachments?: boolean,
	onAttachmentClick: onAttachmentClick
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

	const postThumbnailOnClick = useCallback((event: Event) => {
		if (onAttachmentClick) {
			onAttachmentClick(
				postThumbnail,
				{ imageElement: event.target as HTMLImageElement }
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
				'--PostThumbnail-width': isVectorImage(postThumbnailSize) ? 'var(--PostThumbnail-maxWidth)' : postThumbnailSize.width + 'px'
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