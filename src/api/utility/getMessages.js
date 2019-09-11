export default function getMessages(messages) {
	return {
		quotedComment: messages.quotedComment,
		hiddenComment: messages.hiddenComment,
		deletedComment: messages.deletedComment,
		...messages.contentType,
		linkTo: messages.post.linkTo
	}
}