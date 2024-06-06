import type { CreateThreadParameters, CreateThreadResult, ThreadFromDataSource } from '@/types'

import { CHANNEL1 } from './data/index.js'

import { ChannelNotFoundError } from '../../../../src/api/errors/index.js'

import getAttachmentForFile from '../../../../src/utility/attachment/getAttachmentForFile.js'
import getNextId from './utility/getNextId.js'
import getContentForText from './utility/getContentForText.js'

export async function createThread({
	channelId,
	title,
	content,
	attachments
}: CreateThreadParameters): Promise<CreateThreadResult> {
	if (channelId === CHANNEL1.id) {
		const id = getNextId()
		const createdAt = new Date()

		// Transform text to `ContentBlock[]` array.
		const contentBlocks = getContentForText(content)

		const thread: ThreadFromDataSource = {
			id,
			channelId: CHANNEL1.id,
			createdAt,
			commentsCount: 1,
			attachmentsCount: attachments ? attachments.length : 0,
			title,
			comments: [{
				id,
				createdAt,
				title,
				content: contentBlocks,
				attachments: attachments ? await Promise.all(attachments.map(getAttachmentForFile)) : undefined
			}]
		}

		CHANNEL1.threads.push(thread)

		return {
			id
		}
	} else {
		throw new ChannelNotFoundError({ channelId })
	}
}