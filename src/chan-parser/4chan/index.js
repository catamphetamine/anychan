export { default as Parser } from './Parser'

const apiOrigin = 'http://a.4cdn.org'

export function getCommentsUrl(boardId, threadId) {
	return `${apiOrigin}/${boardId}/thread/${threadId}.json`
}

export function getThreadsUrl(boardId) {
	return `${apiOrigin}/${boardId}/catalog.json`
}

export function getBoardsUrl() {
	return `${apiOrigin}/boards.json`
}

// export function getUrl(boardId, threadId, commentId) {
// 	// "NSFW" ("18+") boards are at "https://boards.4chan.org/".
// 	return `https://boards.4channel.org/${boardId}/thread/${threadId}#p${commentId}`
// }