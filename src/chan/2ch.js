import configuration from '../configuration'

export { GET_BOARDS_RESPONSE_EXAMPLE } from './2ch.test.data'

export const id = "2ch"

export function getApiUrl(path) {
	return configuration.corsProxyUrl.replace('{url}', `https://2ch.hk${path}`)
}

// export function getUrl(boardId, threadId, commentId) {
// 	return `https://2ch.hk/${boardId}/res/${threadId}.html#${commentId}`
// }