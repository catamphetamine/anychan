import generatePostPreview from 'webapp-frontend/src/utility/post/generatePostPreview'

export default function constructThread(
	commentsCount,
	attachmentsCount,
	comment,
	isClosed,
	isEndless,
	isSticky,
	{
		commentLengthLimit
	}
) {
	// Generate preview for long comments.
	if (comment.content) {
		if (commentLengthLimit) {
			const preview = generatePostPreview(comment, { limit: commentLengthLimit })
			if (preview) {
				comment.contentPreview = preview
			}
		}
	}
	return {
		id: comment.id,
		isClosed,
		isEndless,
		isSticky,
		commentsCount,
		attachmentsCount,
		comments: [
			comment
		]
	}
}