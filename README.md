# <img src="https://raw.githubusercontent.com/catamphetamine/captchan/master/assets/images/icon%40192x192.png" width="48" height="48"/> captchan

Modern GUI for imageboards (4chan.org, 8ch.net (8kun.top), 2ch.hk, kohlchan.net, etc).

Based on [`imageboard`](https://github.com/catamphetamine/imageboard) library.

Supported engines:

* [4chan](https://github.com/4chan/4chan-API)

	1. [4chan.org](https://www.4chan.org/) — [demo](https://catamphetamine.github.io/captchan/4chan)

* [vichan](https://github.com/vichan-devel/vichan)

	1. [lainchan.org](https://lainchan.org/) — [demo](https://catamphetamine.github.io/captchan/lainchan)

* [OpenIB](https://github.com/OpenIB/OpenIB/) (formerly [infinity](https://github.com/ctrlcctrlv/infinity))

	1. [8ch.net (8kun.top)](https://8kun.top/) — [demo](https://catamphetamine.github.io/captchan/8ch)

* [lynxchan](https://gitgud.io/LynxChan/LynxChan)

	1. [kohlchan.net](https://kohlchan.net) — [demo](https://catamphetamine.github.io/captchan/kohlchan)
	2. [endchan.net](https://endchan.net) — [demo](https://catamphetamine.github.io/captchan/endchan)

* [makaba](https://2ch.hk/api/)

	1. [2ch.hk](https://2ch.hk/) — [demo](https://catamphetamine.github.io/captchan/2ch)

<!-- (too much DDoS protection [won't let it in](https://github.com/OpenIB/OpenIB/issues/302)) -->
<!-- , [`arisuchan.jp` demo](https://catamphetamine.github.io/captchan/?chan=arisuchan). -->

Don't mind the seemingly slower speed of the demos: the only reason for that is the app can't use chan APIs directly (they don't allow it) and needs to send all HTTP requests through a free public "CORS Proxy" which introduces a delay.

This project currently has only a subset of features. "To do":

  * Add message posting.
  * Add thread watching.
  * Add thread auto-update.
  * Add support for "passes" (`4chan.org`, `2ch.hk`).

<!--
	Miscellaneous:

  * Add comment menu: Hide, Report, Copy Link, View Source, Hide all posts from this author (if `post.id` is available), Expand all images/videos, Run slideshow for all attachments, Open on original website.
	* Maybe add delete post/attachment button. (can delete posts and files without password on 4chan)
	* When text is selected, show "Reply" tooltip for quoting the selected text in a reply.
	* Add post selection from post menu to report several posts in a single report.
	* Format MathML equations on `4chan.org/sci`. Block-level equations: [eqn]f(x_4) = a+2*b[/eqn]. Inline equations: [math]f(x)=\\frac{x^3-x}{(x^2+1)^2}[/math].
-->

## Themes

The app comes pre-packaged with a couple of built-in themes and [allows any degree of customization](https://github.com/catamphetamine/captchan/blob/master/docs/themes/guide.md) via adding custom themes. Each theme has "Light" mode and "Dark" mode.

#### Default theme (Light)

[View in full resolution](https://raw.githubusercontent.com/catamphetamine/captchan/master/docs/images/default-theme-light-mode-3605x1955.png)

<img src="https://raw.githubusercontent.com/catamphetamine/captchan/master/docs/images/default-theme-light-mode-1024x555.png" width="512" height="277"/>

#### Default theme (Dark)

[View in full resolution](https://raw.githubusercontent.com/catamphetamine/captchan/master/docs/images/default-theme-dark-mode-3605x1955.png)

<img src="https://raw.githubusercontent.com/catamphetamine/captchan/master/docs/images/default-theme-dark-mode-1024x555.png" width="512" height="277"/>

<!--
### Neon Genesis Evangelion

#### Light

[View in full resolution](https://raw.githubusercontent.com/catamphetamine/captchan/master/docs/images/eva-theme-light-mode-3605x1955.png)

<img src="https://raw.githubusercontent.com/catamphetamine/captchan/master/docs/images/eva-theme-light-mode-1024x555.png" width="512" height="277"/>

#### Dark

[View in full resolution](https://raw.githubusercontent.com/catamphetamine/captchan/master/docs/images/eva-theme-dark-mode-3605x1955.png)

<img src="https://raw.githubusercontent.com/catamphetamine/captchan/master/docs/images/eva-theme-dark-mode-3605x1955.png" width="512" height="277"/>

## Screenshots

### Media

[View in full resolution](https://raw.githubusercontent.com/catamphetamine/captchan/master/docs/images/screenshot-slideshow-3602x1952.png)

<img src="https://raw.githubusercontent.com/catamphetamine/captchan/master/docs/images/screenshot-slideshow-1024x555.png" width="512" height="278"/>
-->

## Known issues

See [known issues](https://github.com/catamphetamine/imageboard#known-issues) of the `imageboard` library.

The lists of threads/comments are implemented via a "[Virtual Scroller](https://github.com/catamphetamine/virtual-scroller)" which results in great performance boost but at the same time [doesn't support some native in-browser features](https://github.com/catamphetamine/virtual-scroller#search-focus-management) such as "Find on page" or "Tab" key navigation or "screen readers".

## Develop

```
git clone git@github.com:catamphetamine/webapp-frontend.git
git clone git@github.com:catamphetamine/captchan.git
cd captchan
npm install
npm run dev
```

Go to [`http://localhost:1234`](http://localhost:1234)

One may also want to create a [custom configuration file](#configuration). Also check if the [proxy](#proxy) server still works.

## Build

```
git clone git@github.com:catamphetamine/webapp-frontend.git
git clone git@github.com:catamphetamine/captchan.git
cd captchan
npm install
npm run build
```

The build will be output to the `build/assets` directory: `index.html` and a bunch of `.js`/`.css`/`.map`/image files with random generated names (and also about a 100 of code syntax highlighter language plugins that are only loaded on demand at runtime when highlighting a given language in "code" blocks).

Prior to running `npm run build` it's recommended to create a [custom configuration file](#configuration) for enabling advanced features.

## Configuration

It's recommended to create a custom configuration file for enabling features like YouTube video link parsing, Google Analytics, error reporting, etc. By default the application uses `./configuration/default.json` settings file. To define custom settings create a `./configuration/configuration.json` file.

<details>
<summary>Configuration example</summary>

#### configuration.json

```js
{
	// The default chan to use.
	// Can be overridden via a `?chan=` URL parameter.
	// For a built-in chan supply the chan id string.
	// For a custom chan supply a chan info JSON object.
	// See the "chan" directory for the list of built-in chans
	// and use their `index.json` files as an example.
	"chan": "4chan",

	// Google Analytics can be used for tracking page views.
	// Though most users block it in their web browsers.
	"googleAnalytics": {
		"id": "UA-123456789-0"
	},

	// YouTube Data API V3 is used for parsing YouTube links
	// into embedded video attachments having a title and a thumbnail.
	"youtube": {
		// Can be single key or an array of keys in which case
		// a key will be randomly selected from the list on every API request.
		// YouTube has a limit of `1 000 000` API requests per day for a key.
		"apiKey": "TpJTfNAIzaFVteEnl4E-SyCvZRvuuHUZeL3owO8"
	},

	// CORS Proxy settings (see the "Proxy" section of the readme).
	// AWS EC2 is the easiest way to set up a free 1-year proxy.
	"corsProxyUrlAws": "https://example.compute.amazonaws.com/{url}",

	// Chans behind CloudFlare CDN deny access for AWS IP addresses.
	// Such chans can be proxied through Heroku, for example.
	"corsProxyUrl": "https://example.herokuapp.com/{url}",

	// `sentry.io` can be set up to report all client-side errors.
	"sentry.io": {
		"url": "https://1d8af64f618e9b01849237ccbc26e968@sentry.io/1413881"
	},

	// Sometimes chan administration needs to announce something
	// to the users. Things like latest news, contests, etc.
	// See the "Announcements" section below.
	// The URL must be a "same-origin" one (a "relative" URL).
	"announcementUrl": "/announcement.json",

	// Announcement polling interval (in milliseconds).
	// By default it checks for new announcements every hour:
	// 60 * 60 * 1000 = 3600000
	"announcementPollInterval": 3600000,

	// Whether to show GDPR Cookie Notice.
	// Is `false` by default.
	"cookieNotice": true,

	// If `cookiePolicyUrl` is set then a "Learn More" link
	// will be shown in the GDPR Cookie Notice.
	"cookiePolicyUrl": "http://example.com/cookie-policy.html",

	// The maximum length of a thread comment (in "points")
	// until a "Read more"  preview is generated for it.
	// Is `1000` by default.
	"commentLengthLimit": 1000,

	// The maximum length of a thread preview (in "points") on board page
	// until a "Read more"  preview is generated for it.
	// Is `500` by default.
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

## Adding a new imageboard

First [add the imageboard to `imageboard`](https://github.com/catamphetamine/imageboard#adding-a-new-imageboard) library. Then add the imageboard to `captchan` itself:

* Create the imageboard's directory in `./chan`.
* Create `index.json`, `logo.svg`/`logo.jpg`/`logo.png` and `icon.png` files in the chan's directory (see other chans as an example).
* Add these files for the imageboard in `./src/chans.js` (same as for the existing chans).

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
	// https://github.com/catamphetamine/webapp-frontend/blob/master/src/utility/post/PostContent.md
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
	// https://github.com/catamphetamine/webapp-frontend/blob/master/src/utility/post/PostContent.md
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
	// CORS proxy settings.
	"proxy": {
		// (optional)
		// Set to `true` if the chan doesn't block the AWS EC2 subnet.
		// Will use Heroku proxy otherwise (which is slower).
		// Is `false` by default.
		"aws": true
	},

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
</details>

## Proxy

None of the imageboards (`4chan.org`, `2ch.hk`, etc) allow calling their API from other websites: they're all configured to block [Cross-Origin Resource Sharing](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) (CORS), so a CORS proxy is required in order for a third party website to be able to query their API.

A public CORS proxy called ["CORS Anywhere"](https://cors-anywhere.herokuapp.com/) can be used for development/testing. Such public CORS proxy imposes several restrictions such as no support for "cookies" and rate limiting. For production, a dedicated CORS proxy should be set up.

A free 1-year [AWS EC2](https://aws.amazon.com/ec2/) "micro" server can be set up as a proxy server. It won't work for all imageboards though: for example, `4chan.org` uses CloudFlare CDN, so it will return `403 Forbidden` in response to any HTTP request received from such AWS EC2 proxy. That's because CloudFlare blocks all traffic from AWS EC2 (I guess because it could be easily set up for a DDoS attack).

[Heroku](https://www.heroku.com/) seems to work with CloudFlare without any issues. It has [another issue](https://devcenter.heroku.com/articles/getting-started-with-nodejs?singlepage=true#scale-the-app) though: a free instance will sleep after a half hour of inactivity (if it doesn’t receive any traffic). This causes a delay of a few seconds for the first request upon waking. Subsequent requests will perform normally.

* [An example of setting up a free 1-year AWS EC2 CORS proxy running NginX](https://github.com/catamphetamine/captchan/tree/master/CORS-PROXY-AWS-NGINX.md).

* [An example of setting up a free CORS proxy on Heroku running "CORS Anywhere"](https://github.com/catamphetamine/captchan/tree/master/CORS-PROXY-HEROKU-CORS-ANYWHERE.md).

####

In `./configuration/default.json` there's `corsProxyUrl` setting — this is the CORS-proxy that will be used for querying chan API. There's also a dedicated `corsProxyUrlAws` setting for chans that don't block AWS yet.

## Browser support

This application uses [CSS Variables](https://caniuse.com/#feat=css-variables).

<!-- [`position: sticky`](https://caniuse.com/#feat=css-sticky) -->
<!-- | —  | 16+  | 32+     | 56+    | 42+   | 9.1+   | 9.3+       | 5+              | -->

<!-- [`fetch`](https://caniuse.com/#feat=fetch) -->
<!-- | —  | 16+  | 39+     | 49+    | 36+   | 10.1+  | 10.3+      | 5+              | -->

| IE | Edge | Firefox | Chrome | Opera | Safari | iOS Safari | Android Browser |
|----|------|---------|--------|-------|--------|------------|-----------------|
| —  | 16+  | 31+     | 49+    | 36+   | 9.1+   | 9.3+       | 5+              |

## License

[MIT](LICENSE)