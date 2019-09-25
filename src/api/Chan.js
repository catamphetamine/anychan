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
			request: (method, url, data) => http[method.toLowerCase()](getProxyUrl(url), data)
		}
	)
}