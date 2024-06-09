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

import { isVectorImage } from "social-components/image"

import getConfiguration from "../../getConfiguration.js"

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
			if (isVectorImage(postThumbnailSize)) {
				return {
					'--PostThumbnail-width': 'var(--PostThumbnail-maxWidth)'
				}
			}

			let postThumbnailRenderedWidth = postThumbnailSize.width

			// Validate `commentThumbnailMaxWidth` configuration parameter just in case.
			if (isNaN(getConfiguration().commentThumbnailMaxWidth)) {
				throw new Error('`commentThumbnailMaxWidth` configuration parameter not set')
			} else {
				postThumbnailRenderedWidth = Math.min(postThumbnailRenderedWidth, getConfiguration().commentThumbnailMaxWidth)
			}

			return {
				'--PostThumbnail-width': postThumbnailRenderedWidth + 'px'
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