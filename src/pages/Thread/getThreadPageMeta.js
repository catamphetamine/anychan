export default function getThreadPageMeta({ data: { channel, thread }}) {
	return {
		title: thread && ('/' + channel.id + '/' + ' — ' + (thread.titleCensored || thread.title)),
		description: thread && thread.comments[0].textPreview,
		image: thread && getThreadImage(thread)
	}
}

function getThreadImage(thread) {
	const comment = thread.comments[0]
	if (comment.attachments && comment.attachments.length > 0) {
		for (const attachment of comment.attachments) {
			switch (attachment.type) {
				case 'picture':
					return attachment.picture.url
				case 'video':
					return attachment.video.picture.url
			}
		}
	}
}