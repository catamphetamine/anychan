import type { Mode, Comment, ThreadId } from "@/types"

export default function useAttachmentThumbnailFlags({
	mode,
	comment,
	threadId
}: {
	mode: Mode,
	comment: Comment,
	threadId: ThreadId
}) {
	const isFirstCommentInThread = comment.id === threadId

	const showOnlyFirstAttachmentThumbnail = mode === 'channel' && isFirstCommentInThread

	const shouldFixAttachmentPictureSize = mode === 'channel' &&
		isFirstCommentInThread &&
		comment.attachments &&
		comment.attachments.length === 1 &&
		comment.attachments[0].isLynxChanCatalogAttachmentsBug

	// `showPostThumbnailWhenThereAreMultipleAttachments` — Pass `true` to allow returning
	// post thumbnail in cases when the `post` has multiple thumbnail-able attachments.
	// By default, if the `post` has multiple thumbnail-able attachments, none of them will be returned.
	const showPostThumbnailWhenThereAreMultipleAttachments =
		(mode === 'channel' && isFirstCommentInThread) ||
		(mode === 'thread' && isFirstCommentInThread)

	// `showPostThumbnailWhenThereIsNoContent` — Pass `true` to allow returning post thumbnail
	// in cases when the `post` has no `content`. By default, if the `post` has no `content`,
	// no post thumbnail will be shown, and the post would be rendered with all of its attachments
	// inside it's content part, without promoting the first one to a "post thumbnail".
	const showPostThumbnailWhenThereIsNoContent = mode === 'channel' && isFirstCommentInThread

	return {
		showOnlyFirstAttachmentThumbnail,
		shouldFixAttachmentPictureSize,
		showPostThumbnailWhenThereAreMultipleAttachments,
		showPostThumbnailWhenThereIsNoContent
	}
}