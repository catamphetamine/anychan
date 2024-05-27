import type { Comment } from "@/types"

export default function useId({
	comment,
	parentComment
}: {
	comment: Comment,
	parentComment?: Comment
}) {
	// Potentially set an HTML `id` attribute for the comment element.
	// When `parentComment` property is defined, it means that the comment
	// is being rendered as part of an expandable tree of replies.
	// In that case, the `id` attribute shouldn't be set on that comment's HTML element
	// because there potentially may be several such elements on a page.
	if (!parentComment) {
		// `id` HTML attribute is intentionally set as "#comment-{commentId}"
		// and not as "#{commentId}", because otherwise, when navigating to a "post-link" URL,
		// a web browser would scroll down to the comment's HTML element, and the floating header
		// would obstruct the very top of the comment element.
		// Instead, when navigating to a "post-link" URL, this application simply
		// shows the comments starting from that one, removing the requirement for scrolling.
		return 'comment-' + comment.id
	}
}