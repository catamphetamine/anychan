# <img src="https://gitlab.com/catamphetamine/captchan/-/raw/master/assets/images/icon%40192x192.png" width="48" height="48"/> captchan

A universal in-browser client for online discussion services like "forums" and "imageboards" ([4chan.org](https://www.4chan.org/), [8ch.net (8kun.top)](https://8kun.top/), [2ch.hk](https://2ch.hk/), [kohlchan.net](https://kohlchan.net/), etc).

Imageboard support is provided by [`imageboard`](https://gitlab.com/catamphetamine/imageboard) library.

Supported imageboard engines:

* [4chan](https://github.com/4chan/4chan-API)

	1. [4chan.org](https://www.4chan.org/) — [demo](https://captchan.surge.sh/4chan)

* [vichan](https://github.com/vichan-devel/vichan)

	1. [lainchan.org](https://lainchan.org/) — [demo](https://captchan.surge.sh/lainchan)

* [OpenIB](https://github.com/OpenIB/OpenIB/) (formerly [infinity](https://github.com/ctrlcctrlv/infinity))

	1. [8ch.net (8kun.top)](https://8kun.top/) — [demo](https://captchan.surge.sh/8ch)

* [lynxchan](https://gitgud.io/LynxChan/LynxChan)

	1. [kohlchan.net](https://kohlchan.net) — [demo](https://captchan.surge.sh/kohlchan)
	2. [endchan.net](https://endchan.net) — [demo](https://captchan.surge.sh/endchan)

* [makaba](https://2ch.hk/api/)

	1. [2ch.hk](https://2ch.hk/) — [demo](https://captchan.surge.sh/2ch)

<!-- (too much DDoS protection [won't let it in](https://github.com/OpenIB/OpenIB/issues/302)) -->
<!-- , [`arisuchan.jp` demo](https://captchan.surge.sh/arisuchan). -->

Don't mind the seemingly slower speed of the demos: the only reason for that is the app can't use imageboard APIs directly (they don't allow it) and needs to send all HTTP requests through a free public "CORS Proxy" which introduces a delay.

This project currently has only a subset of features. ["To do"](https://trello.com/b/68XTgoLV/captchan).

<!--
	Miscellaneous:

  * Add comment menu: Hide, Report, Copy Link, View Source, Hide all posts from this author (if `post.id` is available), Expand all images/videos, Run slideshow for all attachments, Open on original website.
	* Maybe add delete post/attachment button. (can delete posts and files without password on 4chan)
	* When text is selected, show "Reply" tooltip for quoting the selected text in a reply.
	* Add post selection from post menu to report several posts in a single report.
	* Format MathML equations on `4chan.org/sci`. Block-level equations: [eqn]f(x_4) = a+2*b[/eqn]. Inline equations: [math]f(x)=\\frac{x^3-x}{(x^2+1)^2}[/math].
-->

## Themes

The app comes pre-packaged with a couple of built-in themes and allows [creating custom themes](https://gitlab.com/catamphetamine/captchan/blob/master/docs/themes/guide.md). Each theme has "Light" mode and "Dark" mode.

#### Default theme (Light)

[View in full resolution](https://gitlab.com/catamphetamine/captchan/-/raw/master/docs/images/default-theme-light-mode-3605x1955.png)

<img src="https://gitlab.com/catamphetamine/captchan/-/raw/master/docs/images/default-theme-light-mode-1024x555.png" width="512" height="277"/>

#### Default theme (Dark)

[View in full resolution](https://gitlab.com/catamphetamine/captchan/-/raw/master/docs/images/default-theme-dark-mode-3605x1955.png)

<img src="https://gitlab.com/catamphetamine/captchan/-/raw/master/docs/images/default-theme-dark-mode-1024x555.png" width="512" height="277"/>

<!--
### Neon Genesis Evangelion

#### Light

[View in full resolution](https://gitlab.com/catamphetamine/captchan/-/raw/master/docs/images/eva-theme-light-mode-3605x1955.png)

<img src="https://gitlab.com/catamphetamine/captchan/-/raw/master/docs/images/eva-theme-light-mode-1024x555.png" width="512" height="277"/>

#### Dark

[View in full resolution](https://gitlab.com/catamphetamine/captchan/-/raw/master/docs/images/eva-theme-dark-mode-3605x1955.png)

<img src="https://gitlab.com/catamphetamine/captchan/-/raw/master/docs/images/eva-theme-dark-mode-3605x1955.png" width="512" height="277"/>

## Screenshots

### Media

[View in full resolution](https://gitlab.com/catamphetamine/captchan/-/raw/master/docs/images/screenshot-slideshow-3602x1952.png)

<img src="https://gitlab.com/catamphetamine/captchan/-/raw/master/docs/images/screenshot-slideshow-1024x555.png" width="512" height="278"/>
-->

## Install

The application is distributed in the form of "releases" ("builds").

A "build" contains an `index.html` file and a bunch of `.js`/`.css`/`.map`/image files with random generated names (and also about a 100 of code syntax highlighter language plugins that are only loaded on demand at runtime when highlighting a given language in` "code"` blocks).

The contents of a "build" could be hosted with any "static" file hosting software (like NginX), including in the "cloud" (like Amazon S3).

The released builds can be found on [GitLab Releases](https://gitlab.com/catamphetamine/captchan/-/releases) page.

<!-- Latest release link: https://gitlab.com/catamphetamine/captchan/-/jobs/artifacts/master/download?job=build -->

To obtain a "build" from source codes, perform a manual build process documented in the [Build](#build) section.

## Configuration

The application provides several configuration options like YouTube API key, Google Analytics id, error reporting services, etc.

The default configuration can be found in `./configuration/default.json` file. Any custom configuration is applied on top of it.

Custom configuration can be specified at the top of the `index.html` file in the global `CONFIG` variable.

<details>
<summary>Configuration options</summary>

#####

```js
{
	// The `provider` parameter specifies a discussion service
	// provider configuration.
	//
	// If the provider is a "supported-out-of-the-box" one,
	// then this parameter can be just the provider id.
	// Examples: "4chan", "8ch", "2ch", "kohlchan", "lainchan", etc.
	//
	// In some cases, the `provider` parameter can be omitted entirely,
	// in which case it'll be automatically detected from the website
	// domain name.
	// For example, if this application runs on `4chan.org` domain,
	// then it assumes that the `provider` parameter is "4chan".
	//
	// In all other cases, the `provider` parameter should be an object
	// specifying various configuration parameters: `logo`, `title`,
	// `api` configuration, etc.
	// See "Adding a new imageboard" section of this readme for more info.
	//
	"provider": "4chan",

	// Provider icon.
	// Overwrites `provider.icon`.
	// Should be of `192px` width and `192px` height.
	"icon": "https://s.4cdn.org/image/favicon.ico",

	// Provider logo (a larger version of an icon).
	// Overwrites `provider.logo`.
	"logo": "https://s.4cdn.org/image/fp/logo-transparent.png",

	// Provider title.
	// Overwrites `provider.title`.
	"title": "4chan",

	// Provider "subtitle" (the text under the title on the home page).
	// Overwrites `provider.subtitle`.
	"subtitle": "Since 2003",

	// Home page content.
	// Overwrites `provider.description`.
	// https://gitlab.com/catamphetamine/social-components/blob/master/docs/Post/PostContent.md
	"description": [
		{
			type: "attachment",
			// An attachment could be a picture, a video (including YouTube), an audio, etc.
			// https://gitlab.com/catamphetamine/social-components/blob/master/docs/Post/PostContentTypes.md
			attachment: {
				type: "picture",
				picture: {
					type: "image/jpeg",
					width: 600,
					height: 438,
					url: "https://s.4cdn.org/image/news/Happybirthday_17th_th.jpg"
				}
			}
		},
		"4chan is a simple image-based bulletin board where anyone can post comments and share images"
	],

	// Header banner HTML markup.
	// Can be used to show ads.
	"headerMarkup": "<iframe .../>",

	// Set this flag to `true` to stretch header markup container
	// to full page width on large screens.
	// By default, header markup container won't stretch past the
	// page content width on large screens.
	"headerMarkupFullWidth": false,

	// Footer banner HTML markup.
	// Can be used to show ads.
	"footerMarkup": "<iframe .../>",

	// Set this flag to `true` to stretch footer markup container
	// to full page width on large screens.
	// By default, footer markup container won't stretch past the
	// page content width on large screens.
	"footerMarkupFullWidth": false,

	// Footer notes content.
	// Overwrites `provider.footnotes`.
	// https://gitlab.com/catamphetamine/social-components/blob/master/docs/Post/PostContent.md
	"footnotes": "Copyright © 2003-2020 4chan community support LLC. All rights reserved",

	// A "path" can be set up to host the app not at the root level
	// of a domain, but at a "subpath" instead. By default, the app assumes
	// that it is hosted at the root level of a domain.
	"path": "/captchan",

	// CORS Proxy settings (see the "Proxy" section of the readme).
	// AWS EC2 is the easiest way to set up a free 1-year proxy,
	// but AWS is blocked on most imageboards as a DDoS prevention measure,
	// so Heroku is used instead.
	// CORS Proxy is only required when running on another domain
	// compared to the imageboard's domain.
	// For example, CORS Proxy is required when running a demo
	// somewhere on `surge.sh` and using "4chan" imageboard.
	"proxyUrl": "https://example.herokuapp.com/{url}",

	// Google Analytics can be used for tracking page views.
	// Though most users block it in their web browsers.
	"googleAnalyticsId": "UA-123456789-0",

	// YouTube Data API V3 is used for parsing YouTube links
	// into embedded video attachments having a title and a thumbnail.
	// "youtubeApiKey" can be single key or an array of keys, in which case
	// a key will be randomly selected from the list on every API request.
	// YouTube has a limit of `1 000 000` API requests per day for a key.
	"youtubeApiKey": "AbCdEfGhIjKlMnOpQrStUvWxYz1234567890",

	// Sometimes the administration needs to announce something
	// to the users. Things like latest news, contests, etc.
	// See the "Announcements" section below.
	// The URL must be a "same-origin" one (a "relative" URL, not an "absolute" one).
	"announcementUrl": "/announcement.json",

	// Announcement polling interval (in milliseconds).
	// By default it checks for new announcements every day:
	// 24 * 60 * 60 * 1000 = 86400000
	"announcementPollInterval": 86400000,

	// `sentry.io` can be set up to report client-side errors.
	"sentryUrl": "https://abcdef1234567890@sentry.io/12345678",

	// Whether to show GDPR Cookie Notice.
	// Is `false` by default.
	"showCookieNotice": true,

	// If `cookiePolicyUrl` is set, then a "Learn More" link
	// will be shown in the GDPR Cookie Notice.
	// This is gonna be the URL of the link.
	"cookiePolicyUrl": "http://example.com/cookie-policy.html",

	// (on thread pages) The maximum length of a thread comment (in "points")
	// until a preview is generated for it and a "Read more" button is shown.
	// Is `1000` "points" by default.
	"commentLengthLimit": 1000,

	// (on board pages) The maximum length of a thread comment (in "points")
	// until a preview is generated for it and a "Read more" button is shown.
	// Is `500` "points" by default.
	"commentLengthLimitForThreadPreview": 500,

	// The fetched list of channels is cached in order to reduce
	// the load on the server.
	// By default, it caches the list of channels for one day.
	"channelsCacheTimeout": 86400000,

	// Additional themes.
	"themes": [{
		"id": "yellow-sea",
		"name": "Yellow Sea",
		"url": "https://yellow.sea/style.css"
	}],

	// Default theme `id`.
	"defaultTheme": "yellow-sea",

	// Custom "default settings".
	// Any "default settings" defined here will be merged
	// with the default "default settings".
	"defaultSettings": {
		"censorWords": false
	},

	// Custom "default censored words".
	// Any "default censored words" defined for the languages here
	// override the default "default censored words" for those languages.
	"defaultCensoredWords": {
		"en": [
			"^cocksuck.*",
			...
		]
	}
}
```

<details>
<summary>Announcements</summary>

###

Sometimes, the administration needs to announce something to the users: things like latest news, contests, etc. For that, "announcement" feature can be used. Among the application files there's `announcement.json` file. By default, it's an empty JSON object (`{}`), meaning that no announcement is shown. To make an announcement, edit `announcement.json` file to add a `date` marker and an announcement [`content`](https://gitlab.com/catamphetamine/social-components/blob/master/docs/Post/PostContent.md).

The default URL for the announcement file is `/announcement.json` (is configurable via `announcementUrl` configuration parameter), and it's queried every hour (is configurable via `announcementPollInterval` configuration parameter).

When there's an announcement, a user is presented with an announcement bar on top of the page. When the user clicks a close (x) button, the announcement is no longer shown for this user until there's a new announcement with a different `date`.

#### announcement.json

```js
{
	// Date in "ISO" format.
	// Could be just a date:
	// date: "2019-07-02"
	// or a date with time:
	"date": "2019-07-02T14:37",
	// Announcement content.
	// https://gitlab.com/catamphetamine/social-components/blob/master/docs/Post/PostContent.md
	"content": [[
		"4chan is now owned and led by ",
		{
			"type": "link",
			"url": "https://twitter.com/hiroyuki_ni",
			"content": "Hiroyuki Nishimura"
		},
		", the founder of the largest anonymous BBS in Japan, 2channel. Read the full announcement on the ",
		{

			"type": "link",
			"url": "https://www.4chan.org/4channews.php",
			"content": "4chan News page"
		},
		"."
	]]
}
```
</details>

<details>
<summary>Labels</summary>

#####

To customize translated labels, one could use the global `LABELS` variable.

```html
<script>
	LABELS.ru.settings.theme.title = "Тема"
</script>
```
</details>

<details>
<summary>Themes</summary>

#####

To add custom themes to the list of built-in themes, supply `themes` configuration parameter:

```js
{
	...
	themes: [
		{
			// An "ID" (for reference).
			id: "yellow-sea",
			// A human-readable name.
			name: "Yellow Sea",
			// Either a URL of a `*.css` file:
			url: "https://yellow.sea/style.css",
			// or CSS itself:
			css: ".light { --Clickable-color: yellow } .dark { --Clickable-color: blue }"
		},
		...
	]
}
```

To set a theme as the default one, set `defaultTheme` configuration parameter to the `id` of the theme:

```js
{
	...
	defaultTheme: "yellow-sea"
}
```

To translate a theme's name in different languages, add the entries in `LABELS`:

```html
<script>
	LABELS.en.settings.theme.themes["yellow-sea"] = "Yellow Sea"
	LABELS.ru.settings.theme.themes["yellow-sea"] = "Жёлтое Море"
</script>
```
</details>

</details>

## Proxy

None of the imageboards (`4chan.org`, `8kun.top`, `2ch.hk`, etc) allow calling their API from other websites: they're all configured to block [Cross-Origin Resource Sharing](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) (CORS), so a CORS proxy is required in order for a third party website to be able to query their API.

A public CORS proxy called ["CORS Anywhere"](https://cors-anywhere.herokuapp.com/) can be used for development/testing. Such public CORS proxy imposes several restrictions such as no support for "cookies" and rate limiting. For production, a dedicated CORS proxy should be set up.

A free 1-year [AWS EC2](https://aws.amazon.com/ec2/) "micro" server can be set up as a proxy server. It won't work for all imageboards though: for example, `4chan.org` uses CloudFlare CDN, so it will return `403 Forbidden` in response to any HTTP request received from such AWS EC2 proxy. That's because CloudFlare blocks all traffic from AWS EC2 (I guess because it could be easily set up for a DDoS attack).

[Heroku](https://www.heroku.com/) seems to work with CloudFlare without any issues. It has [another issue](https://devcenter.heroku.com/articles/getting-started-with-nodejs?singlepage=true#scale-the-app) though: a free instance will sleep after a half hour of inactivity (if it doesn’t receive any traffic). This causes a delay of a few seconds for the first request upon waking. Subsequent requests will perform normally.

* [An example of setting up a free 1-year AWS EC2 CORS proxy running NginX](https://gitlab.com/catamphetamine/captchan/tree/master/docs/proxy/CORS-PROXY-AWS-NGINX.md).

* [An example of setting up a free CORS proxy on Heroku running "CORS Anywhere"](https://gitlab.com/catamphetamine/captchan/tree/master/docs/proxy/CORS-PROXY-HEROKU-CORS-ANYWHERE.md).

####

In `./configuration/default.json` there's `proxyUrl` setting — this is the CORS-proxy that will be used for querying the API.

<!-- There's also a dedicated `proxyUrlAws` setting for providers that don't block AWS yet. -->

## Known issues

#### Server-Side Rendering

This application uses React, and can be rendered both on client side and server side. But, React is rumoured to be rather slow when it comes to server-side rendering, compared to the "classic" way of generating web pages from simple templates (like PHP). I didn't benchmark server-side rendering of this app, but I'd assume that, for a high-load website, it would make a difference to use a more performant solution (cost-wise). Maybe it could be some kind of a separate "static" "archive" version that would be very minimalistic, and would be easily indexed by search engines. Both Google and Bing still can index client-side websites that use javascript for the initial loading, but a separate "static" website would most likely get better "score".

#### Virtualized Lists

The lists of threads/comments are implemented via a "[Virtual Scroller](https://gitlab.com/catamphetamine/virtual-scroller)" which results in great performance boost but at the same time [doesn't support some native in-browser features](https://gitlab.com/catamphetamine/virtual-scroller#search-focus-management) such as "Find on page" or "Tab" key navigation or "screen readers".

#### Imageboards

For known imageboard issues, see [known issues](https://gitlab.com/catamphetamine/imageboard#known-issues) of the `imageboard` library.

## Provider configuration

The `captchan` client application supports any data provider as a datasource. It could be an online forum, an imageboard, something like [reddit.com](https://reddit.com), etc. There're currently several imageboards that're supported "out of the box".

To add a new provider, create an `index.json` file with the provider's configuration, along with some supplementary files like a 192x192 `icon.png` and a `logo.svg`.

<details>
<summary><code>index.json</code> format</summary>

###

```js
{
	// (required)
	// Provider's unique ID.
	"id": "4chan",

	// (required)
	// Provider's domain name.
	"domain": "4chan.org",

	// (required)
	// Provider title.
	"title": "4chan",

	// (optional)
	// The text displayed under the provider's title on the home page.
	"subtitle": "The imageboard",

	// (required)
	// Provider description.
	// Can be a `String` or `InlineContent` (text with hyperlinks):
	// https://gitlab.com/catamphetamine/social-components/-/blob/master/docs/Post/PostContent.md
	"description": "4chan is the oldest English-speaking imageboard",

	// (optional)
	// Footer links.
	// Each link must have `text` and `url`.
	// Link `type` is optional and currently doesn't have any effect.
	"links": [{
		"type": "rules",
		"text": "Rules",
		"url": "http://www.4chan.org/rules"
	}, {
		"type": "faq",
		"text": "FAQ",
		"url": "http://www.4chan.org/faq"
	}, {
		"type": "twitter",
		"text": "Twitter",
		"url": "https://twitter.com/4chan"
	}],

	// (optional)
	// Footer notes.
	// Can be a `String` or `InlineContent` (text with hyperlinks):
	// https://gitlab.com/catamphetamine/webapp-frontend/blob/master/src/utility/post/PostContent.md
	"footnotes": "Copyright © 2003-2019 4chan community support LLC. All rights reserved.",

	// (optional)
	// Defines the order of channel categories in the sidebar
	// when "By Category" channel list view mode is selected.
	"contentCategories": [
		"Japanese Culture",
		"Video Games",
		"Interests",
		"Creative",
		"Other",
		"Miscellaneous",
		"Adult"
	],

	// (optional)
	// If channels are divided into categories,
	// and if there's an alias for "all the rest",
	// then such channels can be hidden in the sidebar
	// (because the channels in the "all the rest" category
	//  are most-likely user-created channels and there's a lot of them).
	// In such case, "Show All Boards" link will appear under the
	// channels list in the sidebar, that the user could click
	// to view the list of all available channels.
	"contentCategoryUnspecified": "Rest",

	// (optional)
	// Most providers use "relative" URLs for attachments.
	// And some of them also have "backup" domains in case
	// their primary domain name is blocked by the authorities.
	// Because `captchan` can run on any domain name,
	// it requires a way to determine whether it is
	// running on a "legitimate" provider domain name
	// in order to decide whether it should leave those attachment
	// URLs as they are (being relative URLs, like "/images/abc.jpg")
	// or convert those  attachment URLs from relative URLs to
	// absolute URLs (like "https://website.net/images/abc.jpg"),
	// otherwise those URLs wouldn't work (for obvious reasons).
	// So, when `captchan` is hosted not on the "main" domain
	// but rather on one of the "backup" domains, it should have
	// a way of knowing that it's still a "legitimate" domain
	// so that it could leave relative attachment URLs as they are.
	// For that, the `domains` provider configuration parameter exists:
	// it should list all legitimate "backup" domains of the provider.
	// The default domain name shouldn't be included in the "domains" list,
	// beacuse it has already been configured as the "domain" property.
	"domains": [
		"kohl.chan",
		"kohlchankxguym67.onion",
		"kohlchan7cwtdwfuicqhxgqx4k47bsvlt2wn5eduzovntrzvonv4cqyd.onion"
	],

	// (optional)
	// Error page pictures.
	"errorPages": {
		"404": {
			"images": [
				"https://s.4cdn.org/image/error/404/404-DanKim.gif",
				"https://s.4cdn.org/image/error/404/404-Anonymous-3.png",
				"https://s.4cdn.org/image/error/404/404-Anonymous-5.png",
				"https://s.4cdn.org/image/error/404/404-Anonymous-6.png"
			]
		}
	},

	// (required)
	// (only for non-imageboards)
	// Thread URL template.
	threadUrl: 'https://www.reddit.com/r/{channelId}/comments/{threadId}',

	// (required)
	// (only for non-imageboards)
	// Comment URL template.
	commentUrl: 'https://www.reddit.com/r/{channelId}/comments/{threadId}/thread-title-peek/{commentId}',

	// (required)
	// (only for non-imageboards)
	// The API methods.
	api: {
		// (required)
		//
		// Returns the list of channels.
		//
		// If there're a lot of channels, can return just the most popular ones,
		// in which case it should also return a `hasMoreChannels: true` flag.
		//
		// `Channel` type mimicks the `Board` type of `imageboard`:
		// https://gitlab.com/catamphetamine/imageboard#board
		//
		async getChannels() {
			return {
				channels: Channel[],
				hasMoreChannels: boolean?
			}
		},

		// (optional)
		// (currently not used)
		//
		// Finds channels by a query.
		//
		// Can be used when `getChannels()` doesn't return the full list of channels.
		//
		// `Channel` type mimicks the `Board` type of `imageboard`:
		// https://gitlab.com/catamphetamine/imageboard#board
		//
		async findChannels(query) {
			return {
				channels: Channel[]
			}
		},

		// (required)
		//
		// Returns a list of threads in a channel.
		//
		// Could support parameters like:
		//
		// * `sort: "new"/"hot"/...` for sorting threads.
		//
		// * `afterThreadId` for paging through `sort: "new"` threads.
		//    In that case, `hasMoreThreads: boolean?` flag should also be returned.
		//
		// * `queryId: string` and `page: number` for paging through
		//    the full list of thread IDs. In that case, `queryId` is
		//    returned from the initial query. This variant supercedes
		//    the `afterThreadId`/`hasMoreThreads` approach for `sort: "new"` threads.
		//
		// `Thread` type mimicks the `Thread` type of `imageboard`:
		// https://gitlab.com/catamphetamine/imageboard#thread
		// (with `boardId` renamed to `channelId`)
		//
		async getThreads({ channelId, sort, afterThreadId, queryId }) {
			return {
				threads: Thread[],
				queryId: string?,
				hasMoreThreads: boolean?
			}
		},

		// (optional)
		// (currently not used)
		//
		// Finds threads by a query.
		//
		// `channelId: string` parameter can be optional
		// if `supportsGlobalThreadSearch` flag is `true` (see below).
		//
		// `Thread` type mimicks the `Thread` type of `imageboard`:
		// https://gitlab.com/catamphetamine/imageboard#thread
		// (with `boardId` renamed to `channelId`)
		//
		async findThreads(query, { channelId, sort, afterThreadId, queryId }) {
			return {
				threads: Thread[],
				queryId: string?,
				hasMoreThreads: boolean?
			}
		},

		// (optional)
		// (currently not used)
		//
		// Should be `true` if the provider supports "global" thread search
		// by calling `.findThreads()` method without `channelId` parameter.
		//
		supportsGlobalThreadSearch: boolean?,

		// (required)
		//
		// Returns full thread info, including some of the comments.
		//
		// If there're more comments, then `hasMoreComments: true` flag
		// should be returned, and the rest of the comments can be fetched
		// via `getThreadComments({ channelId, threadId, afterCommentId, queryId })`.
		//
		// `Comment` type mimicks the `Comment` type of `imageboard`:
		// https://gitlab.com/catamphetamine/imageboard#comment
		//
		async getThread({ channelId, threadId }) {
			return {
				id: threadId,
				title: 'Thread Title',
				comments: Comment[],
				commentsCount: 12345,
				hasMoreComments: boolean?,
				...
			}
		},

		// (optional)
		// (currently not used)
		//
		// Returns a list of comments in a thread.
		//
		// Can return just a portion of all available comments,
		// in which case it should also return a `hasMoreComments: true` flag.
		// `queryId` can be used in complex cases: for example,
		// when fetching comments not sorted by date.
		// (like tree-structured comments on `reddit.com`).
		//
		// The `Comment` type mimicks the `Comment` type of `imageboard`:
		// https://gitlab.com/catamphetamine/imageboard#comment
		//
		async getThreadComments({ channelId, threadId, afterCommentId, queryId }) {
			return {
				comments: Comment[],
				hasMoreComments: boolean?
			}
		},

		// (optional)
		//
		// Votes for a comment in a thread.
		// Can be either an upvote or a downvote.
		//
		async vote({ channelId, threadId, commentId, up: boolean }) {
			...
		}
	}
}
```
<!--
	// (optional)
	// CORS proxy settings.
	// By default, all imageboards require a "CORS Proxy" in order to
	// be able to send HTTP requests to imageboard API (and get a response).
	// Theoretically, some imageboard admins could allow "Cross-Origin" HTTP requests
	// and in that case no proxying would be required when making HTTP requests from other domains,
	// in which case set the `"proxy"` setting to `false`.
	// By default it's set to `true` meaning "proxying is required".
	"proxy": false,
-->
</details>

The files should be placed in the provider's directory created inside the `providers` folder. Then, the provider's config should be `import`ed in `providers/index.js` and added to the list of `PROVIDERS`. After that, the provider's `icon` and `logo` should be assigned in `src/provider.js`.

## Adding a new imageboard

First, [add the new imageboard to `imageboard` library](https://gitlab.com/catamphetamine/imageboard#adding-a-new-imageboard). Then add the new imageboard to `captchan` application:

* Create the imageboard's directory in `./providers/imageboards`.
* In that directory, create `index.json` [configuration file](#provider-configuration). Create an `icon.png` (`192px x 192px`) and a `logo.svg` (or `logo.jpg`, or `logo.png`). See other imageboards' directories as an example.
* Add the new imageboard in `./providers/imageboards/index.js` (analogous to the existing imageboards).
* Add the new imageboard in `./src/providers.js` (analogous to the existing imageboards).

<!--
## Browser support

This application uses [CSS Variables](https://caniuse.com/#feat=css-variables).
-->

<!-- [`position: sticky`](https://caniuse.com/#feat=css-sticky) -->
<!-- | —  | 16+  | 32+     | 56+    | 42+   | 9.1+   | 9.3+       | 5+              | -->

<!-- [`fetch`](https://caniuse.com/#feat=fetch) -->
<!-- | —  | 16+  | 39+     | 49+    | 36+   | 10.1+  | 10.3+      | 5+              | -->

<!--
| IE | Edge | Firefox | Chrome | Opera | Safari | iOS Safari | Android Browser |
|----|------|---------|--------|-------|--------|------------|-----------------|
| —  | 16+  | 31+     | 49+    | 36+   | 9.1+   | 9.3+       | 5+              |
-->

## Develop

To develop the application, clone the repos, install the dependencies, and run the app.

```
git clone git@gitlab.com:catamphetamine/webapp-frontend.git
git clone git@gitlab.com:catamphetamine/captchan.git
cd captchan
npm install
npm run dev
```

Go to [`http://localhost:1234/4chan`](http://localhost:1234/4chan)

To specify custom "dev mode" [configuration options](#configuration) (like a YouTube API key), create `configuration/custom.json` file. Also, check if the [proxy](#proxy) server configured by default still works.

## Build

The application is distributed in the form of "releases" (builds). To create a build from sources, follow the instructions in the [Develop](#develop) section, but instead of running `npm run dev` run `npm run build`.

The build will be output to the `build` directory: `index.html` and a bunch of `.js`/`.css`/`.map`/image files with random generated names (and also about a 100 of code syntax highlighter language plugins that are only loaded on demand at runtime when highlighting a given language in` "code"` blocks).

To pack the `build` directory contents into a `*.zip` archive, run `npm run build:pack`.

## GitHub

On March 9th, 2020, GitHub, Inc. silently [banned](https://medium.com/@catamphetamine/how-github-blocked-me-and-all-my-libraries-c32c61f061d3) my account (erasing all my repos, issues and comments) without any notice or explanation. Because of that, all source codes had to be promptly moved to GitLab. The [GitHub repo](https://github.com/catamphetamine/captchan) is now only used as a backup (you can star the repo there too), and the primary repo is now the [GitLab one](https://gitlab.com/catamphetamine/captchan). Issues can be reported in any repo.

## License

[MIT](LICENSE)