# <img src="https://gitlab.com/catamphetamine/anychan/-/raw/master/assets/images/icon/icon-192.png" width="36" height="36"/> anychan

A universal web client for online discussion services like "forums" or ["imageboards"](https://tvtropes.org/pmwiki/pmwiki.php/Main/Imageboards).

<!--
: [4chan.org](https://www.4chan.org/), [8ch.net (8kun.top)](https://8kun.top/), [2ch.hk](https://2ch.hk/), [kohlchan.net](https://kohlchan.net/), etc.
-->

Supported data sources:

* Any imageboard that is supported by [`imageboard`](https://gitlab.com/catamphetamine/imageboard) package.
  * [2ch](https://anychans.github.io/2ch)
  * [4chan](https://anychans.github.io/4chan)
  * [8kun](https://anychans.github.io/8ch) (formerly `8ch`)
  * [kohlchan](https://anychans.github.io/kohlchan)
  * [endchan](https://anychans.github.io/endchan)
  * [lainchan](https://github.com/lainchan/lainchan)
  * [tvchan](https://anychans.github.io/tvchan)
  * [bandada](https://anychans.github.io/bandada)
  * [tahtach](https://anychans.github.io/tahtach)
  * [vecchiochan](https://anychans.github.io/vecchiochan)
  * [smugloli](https://anychans.github.io/smugloli)
  * [jakparty.soy](https://anychans.github.io/jakpartysoy)
  * [alogsspace](https://anychans.github.io/alogsspace)
  * [junkuchan](https://anychans.github.io/junkuchan)
* (Planned) An "example" (non-imageboard) data source.

<!-- (too much DDoS protection [won't let it in](https://github.com/OpenIB/OpenIB/issues/302)) -->
<!-- , [`arisuchan.jp` demo](https://anychans.github.io/arisuchan). -->

Don't mind the seemingly slower speed of the demos: the only reason for that is the app can't use imageboard APIs directly (they don't allow it) and needs to send all HTTP requests through a free public "CORS Proxy" which introduces a delay.

<!-- This project currently has only a subset of features. ["To do"](https://trello.com/b/68XTgoLV/captchan). -->

<!--
  Miscellaneous:

  * Add comment menu: Hide, Report, Copy Link, View Source, Hide all posts from this author (if `post.id` is available), Expand all images/videos, Run slideshow for all attachments, Open on original website.
  * Maybe add delete post/attachment button. (can delete posts and files without password on 4chan)
  * When text is selected, show "Reply" tooltip for quoting the selected text in a reply.
  * Add post selection from post menu to report several posts in a single report.
  * Format MathML equations on `4chan.org/sci`. Block-level equations: [eqn]f(x_4) = a+2*b[/eqn]. Inline equations: [math]f(x)=\\frac{x^3-x}{(x^2+1)^2}[/math].
-->

## GitHub

On March 9th, 2020, GitHub, Inc. silently [banned](https://medium.com/@catamphetamine/how-github-blocked-me-and-all-my-libraries-c32c61f061d3) my account (erasing all my repos, issues and comments) without any notice or explanation. Because of that, all source codes had to be promptly moved to GitLab. The [GitHub repo](https://github.com/catamphetamine/anychan) is now only used as a backup (you can star the repo there too), and the primary repo is now the [GitLab one](https://gitlab.com/catamphetamine/anychan). Issues can be reported in any repo.

## Hosting

The application is distributed in the form of "releases" ("builds"). The "builds" can be found on [GitLab Releases](https://gitlab.com/catamphetamine/anychan/-/releases) page, but those're most likely stale, so I'd recommend creating your own "build" from the sources as described in the [Build](#build) section.

A "build" contains an `index.html` file and a bunch of `.js`/`.css`/`.map`/image files with random generated names (and also about a 100 of code syntax highlighter language plugins that are only loaded on demand at runtime when highlighting a given language in `"code"` blocks).

Inside a "build", find and edit the `index.html` file in order to specify custom [configuration options](#configuration) such as:
* URL path at which the contents of the "build" are hosted (the default is "hosted at the root of the domain").
* The default "data source" id (like `"4chan"`).
* YouTube API key for loading YouTube video links.

Those custom configuration options should be specified at the top of the `index.html` file in the global `CONFIG` variable:

```html
<html>
  <head>
    <script>
      // Set your config parameters here.
      // https://gitlab.com/catamphetamine/anychan#configuration
      var CONFIG = {
        "path": "/my-custom-file-hosting-path",
        "dataSource": "my-custom-default-data-source-id",
        "youtubeApiKey": "my-custom-youtube-api-key",
        "googleAnalyticsId": "my-custom-google-analytics-id"
      }
    </script>
...
```

After saving the changes to the `index.html` file, the contents of the "build" folder should be "statically" hosted somewhere, be it on a server using "static" file hosting software (like NginX), or somewhere in a "cloud" (like Amazon S3 + CloudFront).

When hosting the contents of a "build", make sure that all "404 Not Found" requests are redirected to that `index.html` file. For example, on AWS S3, that could be [done](https://docs.aws.amazon.com/AmazonS3/latest/userguide/CustomErrorDocSupport.html) by specifying `index.html` as the name of the "error document". Another example would be GitHub Pages where `index.html` file should be copied into a new file called `404.html`.

<!-- Latest release link: https://gitlab.com/catamphetamine/anychan/-/jobs/artifacts/master/download?job=build -->

To create a most-recent "build" from the latest source codes, one should perform a manual build process documented in the [Build](#build) section.

## Configuration

The application provides several configuration options like YouTube API key, Google Analytics id, etc.

The default configuration can be found in `./configuration/default.json` file. Any custom configuration is applied on top of it. Custom configuration can be specified at the top of the `index.html` file in the global `CONFIG` variable.

See [`types/Configuration.ts`](https://gitlab.com/catamphetamine/anychan/-/blob/master/src/types/Configuration.ts) for the most up-to-date description of a configuration object.

<details>
<summary>Configuration options</summary>

#####

```js
{
  // The `dataSource` parameter describes the data source being used.
  //
  // If the data source is a "supported-out-of-the-box" one,
  // then the "dataSource" parameter can be set to such data source name:
  //
  // * "4chan"
  // * "8ch"
  // * "2ch"
  // * "kohlchan"
  // * "lainchan"
  // * etc
  //
  // Specifying the "dataSource" parameter in such cases can be omitted
  // if this application runs on the data source's main domain (e.g. "4chan.org")
  // because the application is smart enough to detect that type of situation
  // and will automatically determine the correct data source name.
  // In other cases — when running the application on other domains —
  // specifying a data source is required, unless you'd prefer the application
  // to run in a "multi-datasource" mode in which case it will require
  // a data source name as a URL path prefix. For example, "https://domain.com/4chan/b".
  //
  // When a data source is not a "supported-out-of-the-box" one,
  // the "dataSource" configuration parameter value should be an object
  // describing various parameters of the data source:
  //
  // * `logo`
  // * `title`
  // * `api`
  // * etc
  //
  // See "Data Sources" section of the docs for more info on
  // the available configuration parameters for a custom data source.
  //
  "dataSource": "4chan",

  // Data source icon.
  // Overwrites `dataSource.icon`.
  // Should be of `192px` width and `192px` height.
  "icon": "https://s.4cdn.org/image/favicon.ico",

  // Data source logo (a larger version of an icon).
  // Overwrites `dataSource.logo`.
  "logo": "https://s.4cdn.org/image/fp/logo-transparent.png",

  // Data source title.
  // Overwrites `dataSource.title`.
  "title": "4chan",

  // Data source "subtitle" (the text under the title on the home page).
  // Overwrites `dataSource.subtitle`.
  "subtitle": "Since 2003",

  // Home page content.
  // Overwrites `dataSource.description`.
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

  // Any arbitrary javascript that will be inserted on every page.
  // Can be used to modify the page in an arbitrary way:
  // * Insert new `<script/>` elements
  // * Insert new `<style/>` elements
  // * Insert new `<link rel="stylesheet"/>` elements
  // * ...
  "javascript": "alert('test')",

  // Any arbitrary HTML that will be inserted in the `<body/>` on every page.
  "bodyHtml": "<iframe .../>",

  // Header banner HTML markup.
  // Can be used to show ads in the header.
  "headerMarkupHtml": "<iframe .../>",

  // Instead of specifying `headerMarkupHtml`,
  // one may prefer specify `headerMarkupContent`.
  // The difference would be that `headerMarkupHtml` should be an HTML string
  // whereas `headerMarkupContent` should be a valid `Content` as defined in `social-components` package readme.
  // If `headerMarkupHtml` is defined, `headerMarkupContent` is ignored.
  "headerMarkupContent": Content,

  // Footer banner HTML markup.
  // Can be used to show ads in the footer.
  "footerMarkupHtml": "<iframe .../>",

  // Instead of specifying `footerMarkupHtml`,
  // one may prefer specify `footerMarkupContent`.
  // The difference would be that `footerMarkupHtml` should be an HTML string
  // whereas `footerMarkupContent` should be a valid `Content` as defined in `social-components` package readme.
  // If `footerMarkupHtml` is defined, `footerMarkupContent` is ignored.
  "footerMarkupContent": Content,

  // Footer notes content.
  // Overwrites `dataSource.footnotes`.
  // https://gitlab.com/catamphetamine/social-components/blob/master/docs/Post/PostContent.md
  "footnotes": "Copyright © 2003-2020 4chan community support LLC. All rights reserved",

  // CORS proxy URL (see the "Proxy" section of the docs).
  //
  // A CORS proxy is required unless this application is running on the
  // data source's main domain (e.g. "4chan.org").
  // That's a stupid limitation of all web browsers.
  //
  // A CORS proxy URL string should contain a target URL parameter.
  // The target URL parameter could be present in that string in one of the two variants:
  // * `{url}` — the target URL.
  // * `{urlEncoded}` — the target URL encoded using `encodeURIComponent()`.
  //
  // Examples:
  // * "https://my-cors-proxy.com/{url}"
  // * "https://my-cors-proxy.com?url={urlEncoded}"
  //
  "proxyUrl": "https://anychan-proxy.vercel.app?url={urlEncoded}",

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
  "cookiePolicyUrl": "https://example.com/cookie-policy.html",

  // (on thread pages) The maximum length of a thread comment (in "points")
  // until a preview is generated for it and a "Read more" button is shown.
  // Is `1000` "points" by default.
  "commentLengthLimit": 1000,

  // (on board pages) The maximum length of a thread comment (in "points")
  // until a preview is generated for it and a "Read more" button is shown.
  // Is `500` "points" by default.
  "commentLengthLimitForThreadPreview": 500,

  // (on board pages when using tile layout)
  // The maximum length of a thread comment (in "points")
  // until a preview is generated for it and a "Read more" button is shown.
  // Is `200` "points" by default.
  "commentLengthLimitForThreadPreviewForTileLayout": 200,

  // How often should the application "poll" the data source for new data.
  // Contrary to "push" updates, "polling" is a technique for continuously
  // re-fetching the data from the data source to see if there're any updates.
  // Older engines, like classic imageboards, don't support "push" updates
  // via WebSockets, so the only way to get updates is by manually "polling"
  // for new data in a loop. The higher the "polling" rate, the more load
  // the server gets.
  //
  // Possible values:
  // * "slow" (default)
  // * "normal"
  //
  "dataPollingRate": "slow",

  // The fetched list of channels is cached in order to reduce
  // the load on the server.
  // By default, it caches the list of channels for one day.
  "channelsCacheTimeout": 86400000,

  // Additional backgrounds (Dark mode).
  "backgroundsDarkMode": [{
    "id": "purple",
    "name": "Purple",
    "backgroundColor": "hsl(259, 45%, 11%)",
    "gradientColor1": "hsl(19deg 27% 17%)",
    "gradientColor2": "hsl(284deg 46% 21%)",
    "gradientAngle": 90,
    "patternOpacity": 0.15,
    // If these two properties aren't defined, the default pattern picture is used.
    "patternUrl": "/domain.com/image.svg",
    "patternSize": "10em"
  }],

  // Default background `id` (Dark mode).
  "defaultBackgroundDarkMode": "purple",

  // Additional backgrounds (Light mode).
  "backgroundsLightMode": [{
    "id": "orange-purple",
    "name": "Orange Purple",
    "gradientColor1": "hsl(34deg 53% 66%)",
    "gradientColor2": "hsl(0deg 46% 70%)",
    // If these two properties aren't defined, the default pattern picture is used.
    "patternUrl": "url('/path/to/image.svg')",
    "patternSize": "10em"
  }],

  // Default background `id` (Light mode).
  "defaultBackgroundLightMode": "orange-purple",

  // Additional themes.
  "themes": [{
    "id": "yellow-sea",
    "name": "Yellow Sea",
    "url": "https://yellow.sea/style.css"
  }],

  // Default theme `id`.
  "defaultTheme": "yellow-sea",

  // When the user goes to "Settings" page, they can modify the application's settings.
  // By default, there're already some settings pre-selected.
  // Those settings are called "default application settings".
  // To customize those "default application settings" for all users,
  // one can supply this `defaultSettings` configuration parameter:
  // any properies from it will override the ones defined in the "default application settings".
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

See [`types/Announcement.ts`](https://gitlab.com/catamphetamine/anychan/-/blob/master/src/types/Announcement.ts) for the most up-to-date description of an announcement object.

```js
{
  // Announcement date, in UTC+0 time zone, in "ISO" format:
  // "<year>-<month>-<day>T<hours>:<minutes>:<seconds>.<milliseconds>Z".
  "date": "2012-12-21T00:00:00.000Z",

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

## Themes

The app comes pre-packaged with a couple of built-in themes and allows [creating custom themes](https://gitlab.com/catamphetamine/anychan/blob/master/docs/themes/guide.md). Each theme has "Light" mode and "Dark" mode.

<!--
#### Default theme (Light)

[View in full resolution](https://gitlab.com/catamphetamine/anychan/-/raw/master/docs/images/default-theme-light-mode-3605x1955.png)

<img src="https://gitlab.com/catamphetamine/anychan/-/raw/master/docs/images/default-theme-light-mode-1024x555.png" width="512" height="277"/>

#### Default theme (Dark)

[View in full resolution](https://gitlab.com/catamphetamine/anychan/-/raw/master/docs/images/default-theme-dark-mode-3605x1955.png)

<img src="https://gitlab.com/catamphetamine/anychan/-/raw/master/docs/images/default-theme-dark-mode-1024x555.png" width="512" height="277"/>
-->
<!--
### Neon Genesis Evangelion

#### Light

[View in full resolution](https://gitlab.com/catamphetamine/anychan/-/raw/master/docs/images/eva-theme-light-mode-3605x1955.png)

<img src="https://gitlab.com/catamphetamine/anychan/-/raw/master/docs/images/eva-theme-light-mode-1024x555.png" width="512" height="277"/>

#### Dark

[View in full resolution](https://gitlab.com/catamphetamine/anychan/-/raw/master/docs/images/eva-theme-dark-mode-3605x1955.png)

<img src="https://gitlab.com/catamphetamine/anychan/-/raw/master/docs/images/eva-theme-dark-mode-3605x1955.png" width="512" height="277"/>

## Screenshots

### Media

[View in full resolution](https://gitlab.com/catamphetamine/anychan/-/raw/master/docs/images/screenshot-slideshow-3602x1952.png)

<img src="https://gitlab.com/catamphetamine/anychan/-/raw/master/docs/images/screenshot-slideshow-1024x555.png" width="512" height="278"/>
-->

## Proxy

None of the imageboards (`4chan.org`, `8kun.top`, `2ch.hk`, etc) allow calling their API from other websites: they're all configured to block [Cross-Origin Resource Sharing](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) (CORS), so a CORS proxy is required in order for a third party website to be able to query their API.

[Read more](https://gitlab.com/catamphetamine/anychan/-/blob/master/docs/proxy/README.md)

<!--
A public CORS proxy called ["CORS Anywhere"](https://cors-anywhere.herokuapp.com/) can be used for development/testing. Such public CORS proxy imposes several restrictions such as no support for "cookies" and rate limiting. For production, a dedicated CORS proxy should be set up.

A free 1-year [AWS EC2](https://aws.amazon.com/ec2/) "micro" server can be set up as a proxy server. It won't work for all imageboards though: for example, `4chan.org` uses CloudFlare CDN, so it will return `403 Forbidden` in response to any HTTP request received from such AWS EC2 proxy. That's because CloudFlare blocks all traffic from AWS EC2 (I guess because it could be easily set up for a DDoS attack).

[Heroku](https://www.heroku.com/) seems to work with CloudFlare without any issues. It has [another issue](https://devcenter.heroku.com/articles/getting-started-with-nodejs?singlepage=true#scale-the-app) though: a free instance will sleep after a half hour of inactivity (if it doesn’t receive any traffic). This causes a delay of a few seconds for the first request upon waking. Subsequent requests will perform normally.
-->

<!-- * [An example of setting up a free CORS proxy on Vercel](https://gitlab.com/catamphetamine/cors-proxy-node/-/blob/main/README.md#hosting). -->

<!-- * [An example of setting up a free 1-year AWS EC2 CORS proxy](https://gitlab.com/catamphetamine/anychan/tree/master/docs/proxy/CORS-PROXY-AWS-EC2.md). -->

<!-- Not every proxy works with every "data source" though: for example, `4chan.org` uses CloudFlare CDN, so it will return `403 Forbidden` in response to any HTTP request received from an AWS EC2 proxy. That's because CloudFlare blocks all traffic from AWS EC2 (I guess because it could be easily set up for a DDoS attack). -->

####

In `./configuration/default.json` there's a `proxyUrl` setting — this is the URL of the CORS-proxy that will be used for querying the API.

<!-- There's also a dedicated `proxyUrlAws` setting for data sources that don't block AWS yet. -->

## Known issues

#### Server-Side Rendering

This application uses React, and can be rendered both on client side and server side. But, React is rumoured to be rather slow when it comes to server-side rendering, compared to the "classic" way of generating web pages from simple templates (like PHP). I didn't benchmark server-side rendering of this app, but I'd assume that, for a high-load website, it would make a difference to use a more performant solution (cost-wise). Maybe it could be some kind of a separate "static" "archive" version that would be very minimalistic, and would be easily indexed by search engines. Both Google and Bing still can index client-side websites that use javascript for the initial loading, but a separate "static" website would most likely get better "score".

<details>
<summary>More details</summary>

#####

This application is built using [`react-pages`](https://www.npmjs.com/package/react-pages) library which does support server-side rendering.

Why even implement server-side rendering? One reason would be for the website to be indexable by search engines in order to be discoverable on the internet.

However, I wouldn't consider server-side rendering suitable for this specific application:

* When I originally started this project in August 2018, React used to be not so performant when it comes to server-side rendering. Writing this section now in October 2023, I didn't bother checking if that situation has changed. So I'll just assume that React, although reasonably fast, it still not the most performant solution when it comes to outputting raw HTML when compared to more simplistic template-based rendering engines that don't even bother executing any javascript. So, for example, an imageboard could employ dual-website strategy: one website could be statically generated and would drive the traffic to the website from search engines, and another website would be this interactive React "Single-Page Application" that doesn't bother with server-side rendering and provides User Experience.

* This application uses [`virtual-scroller`](https://www.npmjs.com/package/virtual-scroller) to only render the currently-visible portion of large lists of comments or threads when run in a web browser. On server side, it would have to render the full lists of those comments. Suppose that's not an issue by itself to the server. But after rendering those large lists of comments on the server, they'd have to be [re-"hydrated"](https://www.gatsbyjs.com/docs/conceptual/react-hydration/) on the client in order to make al that raw HTML snapshot interactive and running. And while doing re-"hydration" on the client, it would have to render the page 1:1 of how it was rendered on the server, meaning that on the client it would have to also render those large lists of comments. And I've tested how rendering large lists of comments performed at the initial stages of developing this application in 2019, and the performance wasn't acceptable: somewhere in the magnitude of 1 second for a list of about a 1000 comments, which is nowhere near being considered "swift".
</details>

#### Virtualized Lists

The lists of threads/comments are implemented via a "[Virtual Scroller](https://gitlab.com/catamphetamine/virtual-scroller)" which results in great performance boost but at the same time [doesn't support some native in-browser features](https://gitlab.com/catamphetamine/virtual-scroller#search-focus-management) such as "Find on page" or "Tab" key navigation or "screen readers".

#### Imageboards

For known imageboard issues, see [known issues](https://gitlab.com/catamphetamine/imageboard#known-issues) of the `imageboard` library.

## Development

First, install Node.js >= 16.

Then perform the initial setup:

```
# Install "frontend-lib"
git clone https://gitlab.com/catamphetamine/frontend-lib.git
cd frontend-lib
yarn link
cd ..

# Install "social-components-react"
git clone https://gitlab.com/catamphetamine/social-components-react.git
cd social-components-react
yarn link
cd ..

# Install "anychan"
git clone https://gitlab.com/catamphetamine/anychan.git
cd anychan
yarn
yarn link frontend-lib
yarn link social-components-react
```

After the initial setup has been completed, the application could be run via:

```
yarn run dev
```

Because this project uses TypeScript, the initial start-up time is quite long.

Wait for it to load and go to [`http://localhost:1234/4chan`](http://localhost:1234/4chan)

To specify custom [configuration options](#configuration) (like YouTube API key), one could create a file called `configuration/custom.json`. The contents of that file would be applied on top of the default configuration when running via `yarn run dev` or `yarn run build`.

Also, check if the [proxy](#proxy) server that is configured by default still works. If it doesn't, the application will show an error page. In that case:
* Start a new "terminal".
* Check out [`anychan-proxy`](https://gitlab.com/catamphetamine/anychan-proxy) repository.
* Go into the folder it has checked out to.
* Run `npm install`.
* Run `npm start`. It will run a local CORS proxy at (assumingly) `"http://localhost:8080"`.
* In `anychan` repository, open `configuration/custom.json` file and set `proxyUrl` there to be (assumingly) `"http://localhost:8080"`.
* Restart `anychan` application.

In future, in case of "pulling" any changes, don't forget to re-run the `yarn` command to update the packages.

## Build

To create a build from the sources, follow the instructions in the [Development](#development) section above, but, at the last step, instead of running `yarn run dev`, run `yarn run build`.

The contents of the "build" will be output to the `build` directory:

* `index.html` — The main HTML file. Configuration could be edited there.
* `announcement.json` — Allows showing an announcement banner. See configuration docs for more info on the contents of that file.
* `readme.txt` — A short description.
* `assets` folder — Contains a bunch of `.js`/`.css`/`.map`/image files with random generated names (and also about a 100 of code syntax highlighter language plugins that are only loaded on demand at runtime when highlighting a given language in` "code"` blocks).

To create a `*.zip` archive of a build, run `yarn run build:pack` command.

## Test

There're some tests written for "utility" functions.

<!--
By default, those tests run in a web browser on page load when developing the website.

To run the tests from console:
-->

```
yarn test
```

## Data Sources

`anychan` supports any data source. It could be an online forum, an imageboard, something like [reddit.com](https://reddit.com), etc. For example, imageboards are supported "out of the box".

To add a new data source, follow the instructions in [`docs/add-new-data-source.md`](https://gitlab.com/catamphetamine/anychan/-/blob/master/docs/add-new-data-source.md).

## Miscellaneous

* [`anychan` art](https://gitlab.com/catamphetamine/anychan-art)

## License

[MIT](LICENSE)