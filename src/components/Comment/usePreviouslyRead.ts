import type { Comment, CommentId } from "@/types"

export default function usePreviouslyRead({
	isPreviouslyRead,
	showingReplies,
	parentComment,
	clickedPostUrl,
	comment
}: {
	isPreviouslyRead: (commentId: CommentId) => boolean,
	showingReplies?: boolean,
	parentComment?: Comment,
	clickedPostUrl?: boolean,
	comment: Comment
}) {
	if (isPreviouslyRead) {
		if (!showingReplies && !parentComment && !clickedPostUrl) {
			return isPreviouslyRead(comment.id)
		}
	}
}