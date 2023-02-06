export default function getMessages(messages) {
	return {
		thread: messages.thread,
		comment: messages.comment,
		contentType: {
	    picture: messages.contentType.picture,
	    video: messages.contentType.video,
	    audio: messages.contentType.audio,
	    attachment: messages.contentType.attachment,
	    link: messages.contentType.link,
			linkTo: messages.post.textContent.linkTo
		}
	}
}