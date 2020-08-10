export default function getUrl(board, thread, comment) {
	if (thread) {
		if (comment && comment.id !== thread.id) {
			return `/${board.id}/${thread.id}#${comment.id}`
		} else {
			return `/${board.id}/${thread.id}`
		}
	} else {
		return `/${board.id}`
	}
}