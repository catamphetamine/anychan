import type { HttpRequestFunction, HttpRequestHeaders, HttpResponseHeaders } from 'imageboard'

import { createHttpRequestFunction as createHttpRequestFunction_ } from 'imageboard'

import getProxiedUrl from '../../utility/proxy/getProxiedUrl.js'

interface Parameters {
	proxyUrl?: string;
}

export default function({ proxyUrl }: Parameters = {}): HttpRequestFunction {
	const isUsingCorsProxy = Boolean(proxyUrl)

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

	// Attaches `cookies` to an outgoing HTTP request when running in a web browser environment.
	//
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
	const setCookiesForCorsProxy = ({
		cookies,
		headers
	}: {
		cookies: Record<string, string>,
		headers: HttpRequestHeaders
	}) => {
		headers['x-cookie'] = Object.keys(cookies).map(key => `${key}=${cookies[key]}`).join('; ')
	}

	// Make an HTTP request using `fetch()`.
	const sendHttpRequest = createHttpRequestFunction_({
		fetch,
		FormData,

		// Attaches `cookies` to an outgoing HTTP request when running in a web browser environment.
		attachCookiesInWebBrowser: isUsingCorsProxy ? setCookiesForCorsProxy : undefined,

		// Returns the real HTTP response status when using a CORS proxy.
		getResponseStatus: (response: { status: number, headers: HttpResponseHeaders }) => {
			// Supports `x-redirect-status` feature of `cors-proxy-node`.
			if (isUsingCorsProxy && !shouldFollowRedirects) {
				if (response.headers.get('x-redirect-status')) {
					const realStatus = Number(response.headers.get('x-redirect-status'))
					if (!isNaN(realStatus)) {
						return realStatus
					}
				}
			}
			// Defaults to `response.status`.
			return response.status
		},

		setHeaders: ({ headers }: { headers: HttpRequestHeaders }) => {
			if (isUsingCorsProxy) {
				headers['x-follow-redirect'] = String(shouldFollowRedirects)
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
		},

		// Transforms HTTP request URL.
		getRequestUrl: ({ url } : { url: string }) => {
			// Proxy the URL (if required).
			if (isUsingCorsProxy) {
				return getProxiedUrl(url, { proxyUrl })
			} else {
				return url
			}
		},

		// Returns the "final" URL after any redirects when using a CORS proxy.
		getFinalUrlFromResponse: (response: { url: string, headers: HttpResponseHeaders }) => {
			// When using a CORS proxy that automatically follows redirects,
			// `response.url` will be the initial URL and won't be the final URL.
			// To get the final URL in that case, `x-final-url` HTTP request header value should looked at.
			// Tested it on `2ch.hk`'s archived threads redirect: without reading `x-final-url`,
			// it wouldn't receive the final "redirected-to" URL.
			if (isUsingCorsProxy) {
				const proxyFinalUrl = response.headers.get('x-final-url')
				if (proxyFinalUrl) {
					return proxyFinalUrl
				}
			}
			// If there were any redirects in the proces,
			// `response.url` is gonna be the final "redirected to" URL.
			return response.url
		},

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
		// The default value for `credentials` is `"same-origin"`
		// meaning that it will send cookies when the application runs on the same domain:
		// https://developer.mozilla.org/en-US/docs/Web/API/fetch#credentials
		//
		credentials: isUsingCorsProxy ? 'include' : undefined
	})

	return async function({
		method,
		url,
		query,
		body,
		headers,
		cookies
	}) {
		return await sendHttpRequest({
			method,
			url,
			query,
			body,
			headers,
			cookies
		})
	}
}