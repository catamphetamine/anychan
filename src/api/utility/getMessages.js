export default function getMessages(messages) {
	return {
		thread: messages.thread,
		comment: messages.comment,
		contentType: {
			...messages.contentType,
			linkTo: messages.post.textContent.linkTo
		}
	}
}