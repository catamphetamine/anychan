# <img src="https://gitlab.com/catamphetamine/captchan/-/raw/master/assets/images/icon%40192x192.png" width="48" height="48"/> captchan

Modern GUI for imageboards (4chan.org, 8ch.net (8kun.top), 2ch.hk, kohlchan.net, etc).

Based on [`imageboard`](https://gitlab.com/catamphetamine/imageboard) library.

Supported engines:

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
<!-- , [`arisuchan.jp` demo](https://captchan.surge.sh/?chan=arisuchan). -->

Don't mind the seemingly slower speed of the demos: the only reason for that is the app can't use chan APIs directly (they don't allow it) and needs to send all HTTP requests through a free public "CORS Proxy" which introduces a delay.

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

The first "build" will be released in the near future. For now, to obtain a "build", perform a manual build process documented in the [Build](#build) section.

## Configuration

The application provides several configuration options like YouTube API key, Google Analytics id, error reporting services, etc.

The default configuration can be found in `./configuration/default.json` file. Any custom configuration is applied on top of it.

Custom configuration can be specified at the top of the `index.html` file in the global `CONFIG` variable.

<details>
<summary>Configuration options</summary>

```js
{
	// Imageboard configuration.
	// Either a supported imageboard id (like "4chan"),
	// or a custom imageboard configuration object: a merge between
	// an `imageboard` chan config and a `captchan` chan config.
	// See the "chan" directory of `captchan` repo for the list of
	// supported imageboards and their `index.json` configs.
	"chan": "4chan",

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

	// Sometimes chan administration needs to announce something
	// to the users. Things like latest news, contests, etc.
	// See the "Announcements" section below.
	// The URL must be a "same-origin" one (a "relative" URL, not an "absolute" one).
	"announcementUrl": "/announcement.json",

	// Announcement polling interval (in milliseconds).
	// By default it checks for new announcements every hour:
	// 60 * 60 * 1000 = 3600000
	"announcementPollInterval": 3600000,

	// `sentry.io` can be set up to report client-side errors.
	"sentryUrl": "https://abcdef1234567890@sentry.io/12345678",

	// Whether to show GDPR Cookie Notice.
	// Is `false` by default.
	"cookieNotice": true,

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
	"commentLengthLimitForThreadPreview": 500
}
```

<details>
<summary>Announcements</summary>

###

Sometimes chan administration needs to announce something to the users. Things like latest news, contests, etc. For that an optional `announcementUrl` configuration parameter exists. For example, if a chan is hosted at `4chan.org` then `announcementUrl` could be `/announcement.json` meaning that the app will periodically try to `GET https://4chan.org/announcement.json`: if the file exists and is not empty then the app will show the announcement — a user will be presented with an announcement bar on top of the page. When a user clicks the close (x) button an `announcementRead` cookie is created with the value of the announcement date and so the announcement is no longer shown for this user until there's a new announcement with a different date.

#### announcement.json

```js
{
	// Date in "ISO" format.
	// Could be just a date:
	// date: "2019-07-02"
	// or a date with time:
	date: "2019-07-02T14:37",
	// Announcement content (either a string or an array of strings and objects).
	content: [
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
	]
}
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

In `./configuration/default.json` there's `proxyUrl` setting — this is the CORS-proxy that will be used for querying chan API. There's also a dedicated `proxyUrlAws` setting for chans that don't block AWS yet.

## Known issues

See [known issues](https://gitlab.com/catamphetamine/imageboard#known-issues) of the `imageboard` library.

The lists of threads/comments are implemented via a "[Virtual Scroller](https://gitlab.com/catamphetamine/virtual-scroller)" which results in great performance boost but at the same time [doesn't support some native in-browser features](https://gitlab.com/catamphetamine/virtual-scroller#search-focus-management) such as "Find on page" or "Tab" key navigation or "screen readers".

## Adding a new imageboard

First, [add the new imageboard to `imageboard`](https://gitlab.com/catamphetamine/imageboard#adding-a-new-imageboard) library. Then add the new imageboard to `captchan` application:

* Create the imageboard's directory in `./chan`.
* Create `index.json`, `icon.png` and `logo.svg` (or `logo.jpg`, or `logo.png`) files in the imageboard's directory (see other imageboards' directories as an example).
* Add the new imageboard in `./src/chans.js` (analogous to the existing imageboards).

<details>
<summary><code>index.json</code> format</summary>

###

```js
{
	// (required)
	// Chan unique ID.
	"id": "4chan",

	// (required)
	// Chan title.
	"title": "4chan",

	// (optional)
	// The text displayed under chan "title" on the home page.
	"subtitle": "The imageboard",

	// (required)
	// Chan description.
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
	// Footer copyright.
	// Can be a `String` or `InlineContent` (text with hyperlinks):
	// https://gitlab.com/catamphetamine/webapp-frontend/blob/master/src/utility/post/PostContent.md
	"copyright": "Copyright © 2003-2019 4chan community support LLC. All rights reserved.",

	// (required)
	// JSON API URLs.
	"api": {
		// (required)
		// The API for getting a thread with its comments.
		"getThread": "/{boardId}/res/{threadId}.json",

		// (required)
		// The API for getting the list of threads of a board.
		"getThreads": "/{boardId}/catalog.json",

		// (optional)
		// The API for getting the boards list.
		// If the "get boards" API is missing
		// (which is the case for `vichan` and `lynxchan` engines)
		// then provide the boards list manually
		// via the "boards" configuration parameter.
		"getBoards": "/boards.json"
	},

	// (optional)
	// If the "get boards" API is missing
	// (which is the case for `vichan` and `lynxchan` engines)
	// then provide the boards list manually
	// via the "boards" configuration parameter.
	"boards": [{
		"id": "art",
		"name": "Art and Design"
	}, {
		"id": "cult",
		"name": "Culture and Media"
	}],

	// (optional)
	// Defines the order of board categories in the sidebar
	// when "By Category" board list view mode is selected.
	"boardCategories": [
		"Japanese Culture",
		"Video Games",
		"Interests",
		"Creative",
		"Other",
		"Miscellaneous",
		"Adult"
	],

	// (optional)
	// If "get boards" API provides board categories
	// and if there're too many boards in some category
	// then such board category can be hidden in the sidebar
	// and "Show All Boards" link will appear under the boards list.
	"hideBoardCategories": [
		"User boards"
	],

	// (optional)
	// The fetched list of boards is cached in order to reduce
	// the load on the server when a user opens multiple tabs.
	// By default, it caches the list of boards for one day.
	"boardsCacheTimeout": 86400000,

	// (optional)
	// Most chans use "relative" URLs for attachments.
	// Some chans also may have "backup" domains
	// in case their primary domain name is
	// blocked by the authorities.
	// These backup domains may be used by `captchan`
	// to output the correct image URLs for such chans:
	// if a chan uses "relative" URLs for attachments
	// and is running on one of its "backup" domains
	// `captchan` will use "relative" image URLs
	// (`/images/...`) rather than absolute ones
	// (`https://default-chan-domain.net/images/...`)
	// so that if `default-chan-domain.net` is unavailable
	// then images won't output "404 Not Found" error.
	// There's no need to include the default domain
	// in the list beacuse it will be included automatically.
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

One may also want to create `configuration/custom.json` file with [custom configuration options](#configuration). Also, check if the configured [proxy](#proxy) server still works.

## Build

The application is distributed in the form of "releases" (builds). To create a build from sources, follow the instructions in the [Develop](#develop) section, but instead of running `npm run dev` do `npm run build`.

The build will be output to the `build` directory: `index.html` and a bunch of `.js`/`.css`/`.map`/image files with random generated names (and also about a 100 of code syntax highlighter language plugins that are only loaded on demand at runtime when highlighting a given language in` "code"` blocks).

## GitHub

On March 9th, 2020, GitHub, Inc. silently [banned](https://medium.com/@catamphetamine/how-github-blocked-me-and-all-my-libraries-c32c61f061d3) my account (erasing all my repos, issues and comments) without any notice or explanation. Because of that, all source codes had to be promptly moved to [GitLab](https://gitlab.com/catamphetamine/captchan). GitHub repo is now deprecated, and the latest source codes can be found on GitLab, which is also the place to report any issues.

## License

[MIT](LICENSE)