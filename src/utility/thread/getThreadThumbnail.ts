import type { Thread, SubscribedThread } from '@/types/index.js'

import { doesAttachmentHavePicture, getAttachmentThumbnailSize } from 'social-components/attachment'

export default function getThreadThumbnail(thread: Thread): SubscribedThread['thumbnail'] | undefined {
	const thumbnailAttachment = thread.comments[0].attachments &&
			thread.comments[0].attachments.filter(doesAttachmentHavePicture)[0]
	if (thumbnailAttachment) {
		const thumbnail = getAttachmentThumbnailSize(thumbnailAttachment)
		const threadThumbnail: SubscribedThread['thumbnail'] = {
			type: thumbnail.type,
			url: thumbnail.url,
			width: thumbnail.width,
			height: thumbnail.height
		}
		// @ts-expect-error
		if (thumbnailAttachment.spoiler) {
			threadThumbnail.spoiler = true
		}
		return threadThumbnail
	}
}