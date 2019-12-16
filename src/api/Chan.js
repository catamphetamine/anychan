import Chan from 'imageboard'
import { getChan, getChanConfig, addChanParameter, isDeployedOnChanDomain } from '../chan'
import getProxyUrl from './utility/getProxyUrl'
import getMessages from './utility/getMessages'
import correctGrammar from './utility/correctGrammar'

export default function Chan_({
	censoredWords,
	messages,
	http
}) {
	return Chan(
		getChanConfig(),
		{
			messages: messages && getMessages(messages),
			censoredWords,
			// `expandReplies: true` option of `imageboard`
			// transforms reply ids into reply comment objects.
			// `expandReplies` must be `true` both here and in `./getThread.js`
			// in `addOnContentChange(comment)` function.
			expandReplies: true,
			useRelativeUrls: isDeployedOnChanDomain(),
			// Simply adds `?chan=...` to comment links.
			// By default `commentUrl` is "/{boardId}/{threadId}#{commentId}".
			commentUrl: decodeURI(addChanParameter('/{boardId}/{threadId}#{commentId}')),
			filterText: getChan().id === '2ch' ? text => correctGrammar(text, { language: 'ru' }) : undefined,
			request: async (method, url, { body, headers }) => {
				// `fetch()` is not supported in Safari 9.x and iOS Safari 9.x.
				// https://caniuse.com/#feat=fetch
				if (window.fetch) {
					const response = await fetch(getProxyUrl(url), { method, headers, body })
					if (response.ok) {
						return response.text()
					}
					const error = new Error(response.statusText)
					error.status = response.status
					throw error
				} else {
					// This is only for Safari 9.x and iOS Safari 9.x, because other browsers will use `fetch()`.
					const response = await http[method.toLowerCase()](getProxyUrl(url), body, {
						headers
					})
					// This is a temporary workaround for `react-pages` parsing JSON automatically.
					if (typeof response !== 'string') {
						return JSON.stringify(response)
					}
					return response
				}
			}
		}
	)
}