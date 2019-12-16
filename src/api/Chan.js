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
			request: (method, url, data) => {
				return http[method.toLowerCase()](getProxyUrl(url), data)
					.then(response => validateResponse(response, url))
			}
			// request: function(method, url, parameters) {
			// 	var HEADERS = {
			// 		// Sometimes imageboards may go offline while still responding with a web page:
			// 		// an incorrect 2xx HTTP status code with HTML content like "We're temporarily offline".
			// 		// Accepting only `application/json` HTTP responses works around that.
			// 		'Accept': 'application/json'
			// 	}
			// 	url = getProxyUrl(url)
			// 	// Sends an HTTP request.
			// 	// Any HTTP request library can be used here.
			// 	// Must return a `Promise` resolving to response JSON.
			// 	switch (method) {
			// 		case 'POST':
			// 			return fetch(url, {
			// 				method: 'POST',
			// 				headers: HEADERS,
			// 				body: JSON.stringify(parameters)
			// 			}).then(function(response) {
			// 				return response.json()
			// 			}).then((response) => {
			// 				return validateResponse(response, url)
			// 			})
			// 		case 'GET':
			// 			return fetch(url, {
			// 				headers: HEADERS
			// 			}).then(function(response) {
			// 				return response.json()
			// 			}).then((response) => {
			// 				return validateResponse(response, url)
			// 			})
			// 		default:
			// 			throw new Error(`Method not supported: ${method}`)
			// 	}
			// }
		}
	)
}

// Sometimes imageboards may go offline while still responding with a web page:
// an incorrect 2xx HTTP status code with HTML content like "We're temporarily offline".
// Accepting only `application/json` HTTP responses works around that.
function validateResponse(response, url) {
	if (typeof response === 'string') {
		throw new Error(`HTTP request to ${url} returned text instead of JSON: ${response}`)
	}
	return response
}