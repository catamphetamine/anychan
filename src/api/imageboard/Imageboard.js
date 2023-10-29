import Imageboard from 'imageboard'

import isDeployedOnDataSourceDomain from '../../utility/dataSource/isDeployedOnDataSourceDomain.js'

import shouldUseProxy from '../../utility/proxy/shouldUseProxy.js'
import getProxiedUrl from '../../utility/proxy/getProxiedUrl.js'
import getMessages from '../utility/getMessages.js'
import shouldMinimizeGeneratedPostLinkBlockQuotes from '../../utility/post/shouldMinimizeGeneratedPostLinkBlockQuotes.js'
import getConfiguration from '../../configuration.js'

export default function Imageboard_(dataSource, {
	messages,
	http,
	userSettings
}) {
	return Imageboard(dataSource.imageboard, {
		messages: messages && getMessages(messages),
		generatedQuoteMaxLength: getConfiguration().generatedQuoteMaxLength,
		generatedQuoteMinFitFactor: getConfiguration().generatedQuoteMinFitFactor,
		generatedQuoteMaxFitFactor: getConfiguration().generatedQuoteMaxFitFactor,
		minimizeGeneratedPostLinkBlockQuotes: shouldMinimizeGeneratedPostLinkBlockQuotes(),
		// `expandReplies: true` flag transforms reply ids into reply comment objects
		// in `comment.inReplyTo[]` and `comment.replies[]`.
		expandReplies: true,
		getSetCookieHeaders({ headers }) {
			// See if the `fetch()` response headers allow reading `set-cookie` header.
			// https://developer.mozilla.org/en-US/docs/Web/API/Headers/getSetCookie
			if (headers.getSetCookie().length > 0) {
				return headers.getSetCookie()
			}
			// Otherwise, fall back to `anychan-proxy`'s workaround with `x-set-cookies` header.
			const xSetCookies = headers.get('x-set-cookies')
			if (xSetCookies) {
				return JSON.parse(xSetCookies)
			}
			return []
		},
		useRelativeUrls: isDeployedOnDataSourceDomain(dataSource),
		request: async (method, url, { body, headers, cookies }) => {
			// If request "Content-Type" is set to be "multipart/form-data",
			// convert the `body` object to a `FormData` instance.
			if (headers['Content-Type'] === 'multipart/form-data') {
				body = createFormData(body)
				// Remove `Content-Type` header so that it autogenerates it from the `FormData`.
				// Example: "multipart/form-data; boundary=----WebKitFormBoundaryZEglkYA7NndbejbB".
				delete headers['Content-Type']
			}

			// Proxy the URL (if required).
			if (shouldUseProxy({ dataSource })) {
				url = getProxiedUrl(url, { userSettings })
			}

			// `Set-Cookie` headers can't be read from `fetch()` response in a web browser:
			//
			// https://developer.mozilla.org/en-US/docs/Web/API/Headers/getSetCookie
			//
			// "Browsers block frontend JavaScript code from accessing the Set-Cookie header,
			//  as required by the Fetch spec, which defines Set-Cookie as a forbidden response
			//  header name that must be filtered out from any response exposed to frontend code."
			//
			// The workaround was simple: just put the values of `Set-Cookie` headers
			// to some other header when sending the response.
			//
			// Setting `x-set-cookies` header to `true`
			// instructs `anychan-proxy` to put the values of `Set-Cookie` headers
			// to `x-set-cookies` header.
			//
			headers['x-set-cookies'] = 'true'

			// Web browsers don't allow the client javascript code to set the contents
			// of the `Cookie` HTTP request header.
			//
			// https://developer.mozilla.org/en-US/docs/Web/API/Headers/getSetCookie
			//
			// But it may be required to send some cookies to the server.
			// For example, to authenticate the user.
			//
			// A workaround is to pass `x-cookies` request header to `anychan-proxy`:
			// it will append the contents of that header to the `cookies` header,
			// using `"; "` as a separator.
			//
			if (cookies) {
				headers['x-cookie'] = Object.keys(cookies).map(key => `${key}=${cookies[key]}`).join('; ')
			}

			// `fetch()` is not supported in Safari 9.x and iOS Safari 9.x.
			// https://caniuse.com/#feat=fetch
			if (window.fetch) {
				// Make an HTTP response using `fetch()`.
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
					url = response.url
					if (shouldUseProxy({ dataSource })) {
						url = response.headers.get('X-Final-Url') || url
					}
					return response.text().then((responseText) => ({
						url,
						responseText,
						headers: response.headers
					}))
				} else {
      		return rejectWithErrorForResponse(response)
				}
			} else {
				// This is only for Safari 9.x and iOS Safari 9.x, because other browsers will use `fetch()`.
				// `await http[method]()` will throw an error with a `.status` property in case of an error.
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
	})
}

// Creates an error from a `fetch()` response.
// Returns a `Promise` and rejects it with the error.
function rejectWithErrorForResponse(response) {
	const error = new Error(response.statusText)
  error.url = response.url
	error.status = response.status
	error.headers = response.headers
	return response.text().then(
		(responseText) => {
			error.responseText = responseText
			throw error
		},
		(error_) => {
			throw error
		}
	)
}

// Converts an object to a `FormData` instance.
function createFormData(body) {
	const formData = new FormData()
	if (body) {
		for (const key of Object.keys(body)) {
			if (body[key] !== undefined && body[key] !== null) {
				if (Array.isArray(body[key])) {
					for (const element of body[key]) {
						formData.append(key + '[]', element)
					}
				} else {
					formData.append(key, body[key])
				}
			}
		}
	}
	return formData
}