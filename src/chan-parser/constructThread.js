import generateTextPreview from './generateTextPreview'

export default function constructThread(
	commentsCount,
	comment,
	isClosed,
	isEndless,
	isSticky
) {
	comment.commentsCount = commentsCount
	// Text preview is used for `<meta description/>`.
	generateTextPreview(comment)
	return {
		id: comment.id,
		isClosed,
		isEndless,
		isSticky,
		comments: [
			comment
		]
	}
}