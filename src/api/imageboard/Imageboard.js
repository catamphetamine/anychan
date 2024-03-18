import Imageboard from 'imageboard'

import isDeployedOnDataSourceDomain from '../../utility/dataSource/isDeployedOnDataSourceDomain.js'

import shouldUseProxy from '../../utility/proxy/shouldUseProxy.js'
import getProxiedUrl from '../../utility/proxy/getProxiedUrl.js'
import getMessages from '../utility/getMessages.js'
import shouldMinimizeGeneratedPostLinkBlockQuotes from '../../utility/post/shouldMinimizeGeneratedPostLinkBlockQuotes.js'
import getConfiguration from '../../configuration.js'

import { getCookie } from 'frontend-lib/utility/cookies.js'

export default function Imageboard_(dataSource, {
	messages,
	getProxyUrl
}) {
	const isUsingCorsProxy = shouldUseProxy({ dataSource })

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
			// Otherwise, fall back to `cors-proxy-node`'s workaround with `x-set-cookies` header.
			if (isUsingCorsProxy) {
				const xSetCookies = headers.get('x-set-cookies')
				if (xSetCookies) {
					return JSON.parse(xSetCookies)
				}
			}
			return []
		},
		useRelativeUrls: isDeployedOnDataSourceDomain(dataSource),
		request: async (method, url, { body, headers, cookies }) => {
			// It can follow redirects for read-only REST API
			// because that could be used if the website URL configuration has changed
			// and some data now resides at a different location.
			//
			// It shouldn't follow redirects for non-read-only REST API though, because:
			//
			// * Non-GET requests could set cookies (by convention).
			//   For example, ancient "login" endpoints for some imageboards
			//   like `2ch.hk` or `4chan.org` do that,
			//   after which they typically redirect to the main page.
			//   When running through a CORS proxy, the proxy would have to support
			//   merging `Set-Cookie` headers for a chain of redirects in order to
			//   not discard that authentication cookie when automatically following the redirect.
			//   But even if it does support that feature, there'd still be an issue:
			//   some ancient imageboards like `4chan.org` don't provide a JSON response
			//   for API endpoints like "post comment" or "post thread", and instead
			//   they output the new comment ID / thread ID in the HTML response.
			//   When running with or without a CORS proxy, and automatically following redirects,
			//   those IDs would be discarded by the final "redirect to" page's HTML,
			//   so in order to not discard those IDs, the `fetch()` function should be configured
			//   to not follow redirects automatically.
			//   If at some point in future `4chan.org` adds a proper JSON API for posting
			//   comments or threads, the automatic following of redirects could be enabled
			//   for any type of HTTP requests. Until then, `4chan.org` is the only restriction
			//   from doing that.
			//
			// const shouldFollowRedirects = method === 'GET' || method === 'HEAD'
			const shouldFollowRedirects = false

			if (isUsingCorsProxy) {
				headers['x-follow-redirect'] = shouldFollowRedirects
			}

			// Not following redirects automatically for GET requests
			// wouldn't work with `fetch()` in CORS mode:
			//
			// Returning status `302` wouldn't work with stupid `fetch()` in CORS mode
			// because when server returns a `302` response in CORS mode,
			// fetch doesn't allow to look into the response and instead sets
			// `response.status` to `0` and `response.headers` to empty headers.
			// https://github.com/denoland/deno/issues/4389
			// It could only potentially work when using `fetch()` in non-CORS mode.
			//
			// So `shouldFollowRedirects` must be `true` for `GET` HTTP requests when using a CORS proxy.

			// Also, when logging in on `2ch.hk`, it will return a `303` redirect with `set-cookie` header,
			// but when using `fetch()` in CORS mode and not following that redirect automatically,
			// stupid `fetch()` will again prevent the app from looking into `response.headers`
			// in the same fashion as described above, so `shouldFollowRedirects` must be `true`
			// for `POST` HTTP requests too.

			// But both of those two issues have been worked around when using a compatible CORS proxy
			// such as `cors-proxy-node`. See `./docs/proxy/README.md` for more info on CORS proxy requirements.
			//
			// How does `cors-proxy-node` work around those issue:
			// it replaces status `30x` in HTTP response with the contents of `X-Redirect-Status`
			// so that `fetch()` in CORS mode doesn't behave in a weird way.
			if (isUsingCorsProxy && !shouldFollowRedirects) {
				headers['x-redirect-status'] = '200'
			}

			// If request "Content-Type" is set to be "multipart/form-data",
			// convert the `body` object to a `FormData` instance.
			if (headers['content-type'] === 'multipart/form-data') {
				body = createFormData(body)
				// Remove `Content-Type` header so that it autogenerates it from the `FormData`.
				// Example: "multipart/form-data; boundary=----WebKitFormBoundaryZEglkYA7NndbejbB".
				delete headers['content-type']
			} else {
				body = JSON.stringify(body)
			}

			// Proxy the URL (if required).
			if (isUsingCorsProxy) {
				url = getProxiedUrl(url, { proxyUrl: getProxyUrl() })
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
			// instructs `cors-proxy-node` to put the values of `Set-Cookie` headers
			// to `x-set-cookies` header.
			//
			if (isUsingCorsProxy) {
				headers['x-set-cookies'] = 'true'
			}

			// Web browsers don't allow the client javascript code to set the contents
			// of the `Cookie` HTTP request header.
			//
			// https://developer.mozilla.org/en-US/docs/Web/API/Headers/getSetCookie
			//
			// But it may be required to send some cookies to the server.
			// For example, to authenticate the user.
			//
			// A workaround is to pass `x-cookie` request header to `cors-proxy-node`:
			// it will append the contents of that header to the `cookies` header,
			// using `"; "` as a separator.
			//
			if (cookies) {
				if (typeof document === 'undefined') {
					// Send `cookies` when not running in a web browser.
					headers['cookie'] = Object.keys(cookies).map(key => `${key}=${cookies[key]}`).join('; ')
				} else {
					if (isUsingCorsProxy) {
						headers['x-cookie'] = Object.keys(cookies).map(key => `${key}=${cookies[key]}`).join('; ')
					} else {
						// When not running through `cors-proxy-node`, a web browser can't control
						// which cookies do get sent as part of an HTTP request.
						// In that case, just validate if the cookies will be sent correctly or not.
						for (const name of Object.keys(cookies)) {
							const expectedValue = cookies[name]
							const actualValue = getCookie(name)
							if (expectedValue && !actualValue) {
								console.error(`Cookie not set: "${name}"`)
							} else if (expectedValue !== actualValue) {
								console.error(`Cookie value mismatch: "${name}". Expected: ${expectedValue}. Actual: ${actualValue}`)
							}
						}
					}
				}
			}

			// `fetch()` is not supported in Safari 9.x and iOS Safari 9.x.
			// https://caniuse.com/#feat=fetch

			// Make an HTTP response using `fetch()`.
			const response = await fetch(url, {
				method,
				headers,
				body,

				// By default, `fetch()` follows any redirects in the process.
				// Many imageboards have API endpoints that set cookies and then redirect.
				// If `fetch()` was to follow those redirects, those `set-cookie` headers
				// from a `status: 302` response would be ignored, and the `imageboard` library
				// should be able to inspect those `set-cookie` headers in order to extract
				// their values. So `fetch()` is specifically configured to not follow redirects.
				redirect: shouldFollowRedirects ? 'follow' : 'manual',

				// https://developer.mozilla.org/en-US/docs/Web/API/Request/mode
				//
				// It's unclear what the default value for the `mode` parameter is.
				//
				// The specification claims that the default `mode` should be "no-cors",
				// meaning that no properties of the response would be readable in case of
				// a CORS request to another domain.
				// https://fetch.spec.whatwg.org/
				//
				// At the same time, Mozilla docs claim that the default value is different
				// depending on the circumstances.
				// https://developer.mozilla.org/en-US/docs/Web/API/Request/mode#default_mode
				//
				// Either way, the most "relaxed" value of the `mode` parameter would be `"cors"`:
				// it allows CORS when sending an HTTP request to another domain.
				//
				// So, basically, when making an HTTP request to another domain,
				// `mode: "cors"` is the only option that would work.
				//
				mode: isUsingCorsProxy ? 'cors' : undefined,

				// `credentials: "include"` parameter enables sending and receiving
				// cookies when not running in CORS mode.
				//
				// An example of a cookie set by another domain would be a `4chan.org` "pass".
				// Basically, it's about user authentication.
				//
				// When running in CORS proxy, it uses another approach:
				// it sends an `x-cookie` header and receives `x-set-cookies` header from the proxy.
				// The values of those headers could be read or set freely in a web browser.
				//
				// Sidenote: enabling `credentials: "include"` also imposes some additional restrictions
				// on the `Access-Control-Allow-Origin` header in that it can't be just `"*"`
				// and has to be a specific "origin" equal to the "origin" making the HTTP request.
				// https://fetch.spec.whatwg.org/#cors-protocol-and-credentials
				//
				credentials: isUsingCorsProxy ? 'include' : undefined
			})

			let responseStatus = response.status

			// Supports `x-redirect-status` feature of `cors-proxy-node`.
			if (isUsingCorsProxy && !shouldFollowRedirects) {
				if (response.headers.get('x-redirect-status')) {
					const realStatus = Number(response.headers.get('x-redirect-status'))
					if (!isNaN(realStatus)) {
						responseStatus = realStatus
					}
				}
			}

			// `response.ok` means `response.status` is `2xx`,
			// and so it doesn't include redirects like `response.status: 302`
			// which are still valid responses.
			if (responseStatus >= 400) {
				return rejectWithErrorForResponse(response, { status: responseStatus, isUsingCorsProxy })
			}

			return response.text().then((responseText) => ({
				url: getFinalUrl(response, { isUsingCorsProxy }),
				status: responseStatus,
				headers: response.headers,
				responseText
			}))
		}
	})
}

// Creates an error from a `fetch()` response.
// Returns a `Promise` and rejects it with the error.
function rejectWithErrorForResponse(response, { status, isUsingCorsProxy }) {
	const error = new Error(response.statusText)
	error.url = getFinalUrl(response, { isUsingCorsProxy })
	error.status = status || response.status
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
  // * For 'multipart/form-data', use `FormData` class.
  // * For 'application/x-www-form-urlencoded', use `URLSearchParams` class.
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

// If there were any redirects in the process,
// returns the final "redirected to" URL.
function getFinalUrl(response, { isUsingCorsProxy }) {
	let url = response.url
	// When using a CORS proxy that automatically follows redirects,
	// `response.url` will be the initial URL and won't be the final URL.
	// To get the final URL in that case, `x-final-url` HTTP request header value should looked at.
	// Tested it on `2ch.hk`'s archived threads redirect: without reading `x-final-url`,
	// it wouldn't receive the final "redirected-to" URL.
	if (isUsingCorsProxy) {
		const proxyFinalUrl = response.headers.get('x-final-url')
		if (proxyFinalUrl) {
			url = proxyFinalUrl
		}
	}
	return url
}