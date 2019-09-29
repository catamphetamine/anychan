export default function getMessages(messages) {
	return {
		comment: messages.comment,
		contentType: {
			...messages.contentType,
			linkTo: messages.post.linkTo
		}
	}
}