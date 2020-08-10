import Chan from 'imageboard'
import {
	getChanId,
	getImageboardConfig,
	isDeployedOnChanDomain
} from '../chan'
import { shouldUseProxy, proxyUrl } from '../utility/proxy'
import getMessages from './utility/getMessages'
import correctGrammar from './utility/correctGrammar'
import configuration from '../configuration'

export default function Chan_({
	censoredWords,
	messages,
	http
}) {
	return Chan(
		getImageboardConfig(),
		{
			messages: messages && getMessages(messages),
			generatedQuoteMaxLength: configuration.generatedQuoteMaxLength,
			generatedQuoteMinFitFactor: configuration.generatedQuoteMinFitFactor,
			generatedQuoteMaxFitFactor: configuration.generatedQuoteMaxFitFactor,
			censoredWords,
			// `expandReplies: true` option of `imageboard`
			// transforms reply ids into reply comment objects.
			// `expandReplies` must be `true` both here and in `./getThread.js`
			// in `addOnContentChange(comment)` function.
			expandReplies: true,
			useRelativeUrls: isDeployedOnChanDomain(),
			// Simply adds `?chan=...` to comment links.
			// By default `commentUrl` is "/{boardId}/{threadId}#{commentId}".
			commentUrl: '/{boardId}/{threadId}#{commentId}',
			filterText: getChanId() === '2ch' ? text => correctGrammar(text, { language: 'ru' }) : undefined,
			request: async (method, url, { body, headers }) => {
				// Proxy the URL (if required).
				if (shouldUseProxy()) {
					url = proxyUrl(url)
				}
				// `fetch()` is not supported in Safari 9.x and iOS Safari 9.x.
				// https://caniuse.com/#feat=fetch
				if (window.fetch) {
					const response = await fetch(url, {
						method,
						headers,
						body,
						// It's unclear which is the default `mode`.
						// The specification claims that it's "no-cors",
						// Mozilla docs claim that it's "same-origin".
						// Either way, it's not what would work with a CORS request to another domain.
						// So `mode` is set to "cors".
						// https://fetch.spec.whatwg.org/
						mode: 'cors',
						// Also send cookies to the server as part of an HTTP request.
						// For example, cookies might include a `4chan.org` "pass" or `2ch.hk` "passcode".
						// The CORS proxy is set up to return `Access-Control-Allow-Credentials: true`
						// and `Access-Control-Allow-Origin: $http_origin` which means that
						// `credentials: "include"` option would work and would include cookies
						// when sending HTTP requests to the server.
						// https://fetch.spec.whatwg.org/#cors-protocol-and-credentials
						credentials: 'include'
					})
					if (response.ok) {
						return response.text()
					}
					const error = new Error(response.statusText)
					error.status = response.status
					throw error
				} else {
					// This is only for Safari 9.x and iOS Safari 9.x, because other browsers will use `fetch()`.
					const response = await http[method.toLowerCase()](url, body, {
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