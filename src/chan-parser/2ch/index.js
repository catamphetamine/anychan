export { default as Parser } from './Parser'

export { GET_BOARDS_RESPONSE_EXAMPLE } from './test.data'

export const id = '2ch'
const apiOrigin = 'https://2ch.hk'

export function getCommentsUrl(boardId, threadId) {
	return `${apiOrigin}/${boardId}/res/${threadId}.json`
}

export function getThreadsUrl(boardId) {
	return `${apiOrigin}/${boardId}/catalog.json`
}

export function getBoardsUrl() {
	return `${apiOrigin}/boards.json`
}

// export function getUrl(boardId, threadId, commentId) {
// 	return `https://2ch.hk/${boardId}/res/${threadId}.html#${commentId}`
// }