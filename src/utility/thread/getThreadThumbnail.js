import { doesAttachmentHavePicture, getAttachmentThumbnailSize } from 'social-components/attachment'

export default function getThreadThumbnail(thread) {
	const thumbnailAttachment = thread.comments[0].attachments &&
			thread.comments[0].attachments.filter(doesAttachmentHavePicture)[0]
	if (thumbnailAttachment) {
		const thumbnail = getAttachmentThumbnailSize(thumbnailAttachment)
		const threadThumbnail = {
			type: thumbnail.type,
			url: thumbnail.url,
			width: thumbnail.width,
			height: thumbnail.height
		}
		if (thumbnailAttachment.spoiler) {
			threadThumbnail.spoiler = true
		}
		return threadThumbnail
	}
}