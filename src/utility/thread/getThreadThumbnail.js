import hasAttachmentPicture from 'social-components/utility/attachment/hasPicture.js'
import getThumbnailSize from 'social-components/utility/attachment/getThumbnailSize.js'

export default function getThreadThumbnail(thread) {
	const thumbnailAttachment = thread.comments[0].attachments &&
			thread.comments[0].attachments.filter(hasAttachmentPicture)[0]
	if (thumbnailAttachment) {
		const thumbnail = getThumbnailSize(thumbnailAttachment)
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