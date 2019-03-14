import { addChanParameter } from '../chan'

export default function getUrl(board, thread, comment) {
	let url
	if (thread) {
		if (comment) {
			url = `/${board.id}/${thread.id}#comment-${comment.id}`
		} else {
			url = `/${board.id}/${thread.id}`
		}
	} else {
		url = `/${board.id}`
	}
	return addChanParameter(url)
}