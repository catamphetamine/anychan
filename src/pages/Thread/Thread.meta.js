export default function getThreadPageMeta({ useSelector }) {
	const channel = useSelector(state => state.data.channel)
	const thread = useSelector(state => state.data.thread)
	return {
		title: thread && ('/' + channel.id + '/' + ' — ' + thread.titleCensored),
		description: thread && thread.comments[0].textPreviewForPageDescription,
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