import Chan from '../imageboard'
import { getChanConfig, addChanParameter, isDeployedOnChanDomain } from '../chan'
import getProxyUrl from './utility/getProxyUrl'

export default function Chan_(options = {}) {
	const { censoredWords, messages, http } = options
	return Chan(
		getChanConfig(),
		{
			messages,
			censoredWords,
			// `expandReplies` must also be `true` in `./getThread.js`
			// in `addOnContentChange(comment)` function.
			expandReplies: true,
			useRelativeUrls: isDeployedOnChanDomain(),
			// Simply adds `?chan=...` to comment links.
			// By default `commentUrl` is "/{boardId}/{threadId}#{commentId}".
			commentUrl: addChanParameter('/{boardId}/{threadId}#{commentId}'),
			request: (method, url, data) => http[method.toLowerCase()](getProxyUrl(url), data)
		}
	)
}