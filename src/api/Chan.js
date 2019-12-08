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
			// `expandReplies` must also be `true` in `./getThread.js`
			// in `addOnContentChange(comment)` function.
			expandReplies: true,
			useRelativeUrls: isDeployedOnChanDomain(),
			// Simply adds `?chan=...` to comment links.
			// By default `commentUrl` is "/{boardId}/{threadId}#{commentId}".
			commentUrl: decodeURI(addChanParameter('/{boardId}/{threadId}#{commentId}')),
			filterText: getChan().id === '2ch' ? text => correctGrammar(text, { language: 'ru' }) : undefined,
			request: (method, url, data) => {
				return http[method.toLowerCase()](getProxyUrl(url), data, {
					headers: {
						// Sometimes imageboards may go offline while still responding with a web page:
						// an incorrect 2xx HTTP status code with HTML content like "We're temporarily offline".
						// Accepting only `application/json` HTTP responses works around that.
						'Accept': 'application/json'
					}
				})
			}
		}
	)
}