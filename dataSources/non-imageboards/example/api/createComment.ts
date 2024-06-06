import type { CommentId, CreateCommentParameters, CreateCommentResult, ThreadFromDataSource } from '@/types'

import { CHANNEL1 } from './data/index.js'

import { ChannelNotFoundError, ThreadNotFoundError } from '../../../../src/api/errors/index.js'

import getAttachmentForFile from '../../../../src/utility/attachment/getAttachmentForFile.js'
import getNextId from './utility/getNextId.js'
import getContentForText from './utility/getContentForText.js'
import getInReplyToIds from './utility/getInReplyToIds.js'
import insertPostLinks from './utility/insertPostLinks.js'

export async function createComment({
	channelId,
	threadId,
	title,
	content,
	attachments
}: CreateCommentParameters): Promise<CreateCommentResult> {
	if (channelId === CHANNEL1.id) {
		const thread = CHANNEL1.threads.find(_ => _.id === threadId)

		if (!thread) {
			throw new ThreadNotFoundError({ channelId, threadId })
		}

		const id = getNextId()

		// Parse the IDs of "in-reply-to" comments from the comment text.
		let inReplyToIds = content && getInReplyToIds(content)

		// If there're any "in-reply-to" comments.
		if (inReplyToIds) {
			// Filter out non-existing "in-reply-to" comment IDs.
			inReplyToIds = inReplyToIds.filter(commentId => thread.comments.some(_ => _.id === commentId))
			if (inReplyToIds.length === 0) {
				inReplyToIds = undefined
			}
		}

		// If there're any "in-reply-to" comments.
		if (inReplyToIds) {
			// Update `replyIds` of "in-reply-to" comments.
			updateReplyIds(thread, id, inReplyToIds)
		}

		// Transform text to `ContentBlock[]` array.
		const contentBlocks = getContentForText(content)

		// Replace `">>commentId"` substrings with `type: "post-link"` elements.
		// https://gitlab.com/catamphetamine/social-components/-/blob/master/docs/Content.md#post-link
		if (inReplyToIds) {
			insertPostLinks({
				content: contentBlocks,
				inReplyToIds,
				threadId,
				channelId,
				getPostLinkContent: ({ commentId }: { commentId: CommentId }) => '>> Comment #' + commentId
			})
		}

		// Increment `commentsCount` and `attachmentsCount`.
		thread.commentsCount++
		thread.attachmentsCount += attachments ? attachments.length : 0

		// Add the comment to the list of comments.
		thread.comments.push({
			id,
			inReplyToIds,
			createdAt: new Date(),
			title,
			content: contentBlocks,
			attachments: attachments ? await Promise.all(attachments.map(getAttachmentForFile)) : undefined
		})

		return {
			id
		}
	} else {
		throw new ChannelNotFoundError({ channelId })
	}
}

function updateReplyIds(thread: ThreadFromDataSource, commentId: CommentId, inReplyToIds: CommentId[]) {
	for (const inReplyToId of inReplyToIds) {
		const comment = thread.comments.find(_ => _.id === inReplyToId)
		if (comment) {
			if (!comment.replyIds) {
				comment.replyIds = []
			}
			comment.replyIds.push(inReplyToId)
		}
	}
}