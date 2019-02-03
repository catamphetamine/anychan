import configuration from '../configuration'

export const id = "4chan"

export function getApiUrl(path) {
	return configuration.corsProxyUrl.replace('{url}', `https://a.4cdn.org${path}`)
}

// export function getUrl(boardId, threadId, commentId) {
// 	// "NSFW" ("18+") boards are at "https://boards.4chan.org/".
// 	return `https://boards.4channel.org/${boardId}/thread/${threadId}#p${commentId}`
// }