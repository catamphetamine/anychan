export default function usePreviouslyRead({
	isPreviouslyRead,
	showingReplies,
	parentComment,
	clickedPostUrl,
	comment
}) {
	if (isPreviouslyRead) {
		if (!showingReplies && !parentComment && !clickedPostUrl) {
			return isPreviouslyRead(comment.id)
		}
	}
}