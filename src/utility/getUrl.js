import { addChanParameter } from '../chan'

export default function getUrl(board, thread, comment) {
	let url
	if (thread) {
		if (comment && comment.id !== thread.id) {
			url = `/${board.id}/${thread.id}#${comment.id}`
		} else {
			url = `/${board.id}/${thread.id}`
		}
	} else {
		url = `/${board.id}`
	}
	return addChanParameter(url)
}