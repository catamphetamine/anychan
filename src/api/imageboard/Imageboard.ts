import type { ImageboardConfig } from 'imageboard'
import type { Messages } from '../../types/index.js'

import Imageboard from 'imageboard'

import getMessages from '../utility/getMessagesForImageboard.js'
import shouldMinimizeGeneratedPostLinkBlockQuotes from '../../utility/post/shouldMinimizeGeneratedPostLinkBlockQuotes.js'
import getConfiguration from '../../getConfiguration.js'

import createHttpRequestFunction from './createHttpRequestFunction.js'

export default function Imageboard_(imageboardConfig: ImageboardConfig, {
	messages,
	proxyUrl,
	originalDomain
}: {
	messages: Messages,
	proxyUrl?: string,
	originalDomain?: string
}) {
	return Imageboard(imageboardConfig, {
		messages: messages && getMessages(messages),
		generatedQuoteMaxLength: getConfiguration().generatedQuoteMaxLength,
		generatedQuoteMinFitFactor: getConfiguration().generatedQuoteMinFitFactor,
		generatedQuoteMaxFitFactor: getConfiguration().generatedQuoteMaxFitFactor,
		minimizeGeneratedPostLinkBlockQuotes: shouldMinimizeGeneratedPostLinkBlockQuotes(),
		// `expandReplies: true` flag adds `comment.inReplyTo[]` and `comment.replies[]` optional properties.
		expandReplies: true,
		getSetCookieHeaders({ headers }): string[] {
			// See if the `fetch()` response headers allow reading `set-cookie` header.
			// https://developer.mozilla.org/en-US/docs/Web/API/Headers/getSetCookie
			if (headers.getSetCookie().length > 0) {
				return headers.getSetCookie()
			}
			// Otherwise, fall back to `cors-proxy-node`'s workaround with `x-set-cookies` header.
			if (proxyUrl) {
				const xSetCookies = headers.get('x-set-cookies')
				if (xSetCookies) {
					return JSON.parse(xSetCookies)
				}
			}
			return []
		},
		useRelativeUrls: Boolean(originalDomain),
		request: createHttpRequestFunction({ proxyUrl })
	})
}