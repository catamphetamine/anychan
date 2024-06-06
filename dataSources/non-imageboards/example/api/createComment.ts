import type { CreateCommentParameters, CreateCommentResult } from '@/types'

import { CHANNEL1 } from './data/index.js'

import { ChannelNotFoundError, ThreadNotFoundError } from '../../../../src/api/errors/index.js'

import getAttachmentForFile from '../../../../src/utility/attachment/getAttachmentForFile.js'
import getNextId from './utility/getNextId.js'
import getContentForText from './utility/getContentForText.js'

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

		thread.commentsCount++
		thread.attachmentsCount += attachments ? attachments.length : 0
		thread.comments.push({
			id,
			title,
			content: getContentForText(content),
			attachments: attachments ? await Promise.all(attachments.map(getAttachmentForFile)) : undefined
		})

		return {
			id
		}
	} else {
		throw new ChannelNotFoundError({ channelId })
	}
}