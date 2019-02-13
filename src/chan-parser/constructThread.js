import generateTextPreview from './generateTextPreview'

export default function constructThread(
	commentsCount,
	attachmentsCount,
	comment,
	isClosed,
	isEndless,
	isSticky
) {
	// Text preview is used for `<meta description/>`.
	generateTextPreview(comment)
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