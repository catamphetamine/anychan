import type { Content } from 'social-components'
import type { Theme, Background, UserSettingsJson } from './index.ts'

export interface Configuration {
  // By default, the application assumes that it's hosted at the root of the domain.
  // If it's not the case, i.e. if it's hosted at a "subpath", then specify that "subpath" here.
  // For example, if the application is hosted at "https://domain.com/application"
  // then the "path" configuration parameter should be set to "/application".
	//
	// Example: "/anychan".
	//
	path?: string;

  // The `dataSource` parameter describes the data source being used.
  //
  // If the data source is a "supported-out-of-the-box" one,
  // then the "dataSource" parameter can be set to such data source name:
  //
  // * "2ch"
  // * "4chan"
  // * "8ch"
  // * "kohlchan"
  // * "lainchan"
  // * ...
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
  // See "Data Sources" section of the readme for the instructions on how to add a new data source.
  //
  // Example: "4chan".
	//
	dataSource?: string;

  // Data source icon.
  // Overwrites `dataSource.icon`.
  // Should be of `192px` width and `192px` height.
  //
	// Example: "https://s.4cdn.org/image/favicon.ico"
	//
	icon?: string;

  // Data source logo (a larger version of an icon).
  // Overwrites `dataSource.logo`.
	//
  // Example: "https://s.4cdn.org/image/fp/logo-transparent.png",
	//
	logo?: string;

  // Data source title.
  // Overwrites `dataSource.title`.
	//
  // Example: "4chan"
	//
	title?: string;

  // Data source "subtitle" (the text under the title on the home page).
  // Overwrites `dataSource.subtitle`.
	//
  // Example: "Since 2003"
	//
	subtitle?: string;

  // Home page content.
  // Overwrites `dataSource.description`.
	//
  // Example: "4chan is a simple image-based bulletin board where anyone can post comments and share images".
	//
	description?: Content;

  // Any arbitrary javascript that will be inserted on every page.
  // Can be used to modify the page in an arbitrary way:
  // * Insert new `<script/>` elements
  // * Insert new `<style/>` elements
  // * Insert new `<link rel="stylesheet"/>` elements
  // * ...
	//
  // Example: "alert('test')"
	//
	javascript?: string;

	// Any arbitrary HTML that will be inserted in the `<body/>` on every page.
	//
	// Example: "<iframe .../>"
	//
	bodyHtml?: string;

  // Header banner HTML markup.
  // Can be used to show ads in the header.
	//
  // Example: "<iframe .../>"
	//
	headerMarkupHtml?: string;

  // Instead of specifying `headerMarkupHtml`,
  // one may prefer specify `headerMarkupContent`.
  // The difference would be that `headerMarkupHtml` should be an HTML string
  // whereas `headerMarkupContent` should be a valid `Content` as defined in `social-components` package readme.
  // If `headerMarkupHtml` is defined, `headerMarkupContent` is ignored.
	headerMarkupContent?: Content;

  // Footer banner HTML markup.
  // Can be used to show ads in the footer.
	//
  // Example: "<iframe .../>"
	//
	footerMarkupHtml?: string;

  // Instead of specifying `footerMarkupHtml`,
  // one may prefer specify `footerMarkupContent`.
  // The difference would be that `footerMarkupHtml` should be an HTML string
  // whereas `footerMarkupContent` should be a valid `Content` as defined in `social-components` package readme.
  // If `footerMarkupHtml` is defined, `footerMarkupContent` is ignored.
	footerMarkupContent?: Content;

  // Footer notes content.
  // Overwrites `dataSource.footnotes`.
  //
  // Example: "Copyright © 2003-2020 4chan community support LLC. All rights reserved"
	//
	footnotes?: Content;

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
	proxyUrl?: string;

  // Google Analytics can be used for tracking page views.
  // Though most users block it in their web browsers.
	//
  // Example: "UA-123456789-0"
	//
	googleAnalyticsId?: string;

  // YouTube Data API V3 is used for parsing YouTube links
  // into embedded video attachments having a title and a thumbnail.
  // "youtubeApiKey" can be single key or an array of keys, in which case
  // a key will be randomly selected from the list on every API request.
  // YouTube has a limit of `1 000 000` API requests per day for a key.
	//
  // Example: "AbCdEfGhIjKlMnOpQrStUvWxYz1234567890"
	//
	youtubeApiKey?: string;

  // Sometimes the administration needs to announce something
  // to the users. Things like latest news, contests, etc.
  // See the "Announcements" section below.
  // The URL must be a "same-origin" one (a "relative" URL, not an "absolute" one).
	//
  // Example: "/announcement.json"
	//
	announcementUrl?: string;

  // Announcement polling interval (in milliseconds).
	//
  // By default it checks for new announcements every day:
  // 24 * 60 * 60 * 1000 = 86400000
	//
  // Example: 86400000
	//
	announcementPollInterval?: number;

  // `sentry.io` can be set up to report client-side errors.
	//
  // Example: "https://abcdef1234567890@sentry.io/12345678",
	//
	sentryUrl?: string;

  // Whether to show GDPR Cookie Notice.
  // Is `false` by default.
	//
  // Example: true
	//
	showCookieNotice?: boolean;

  // If `cookiePolicyUrl` is set, then a "Learn More" link
  // will be shown in the GDPR Cookie Notice.
  // This is gonna be the URL of the link.
	//
  // Example: "https://example.com/cookie-policy.html"
	//
	cookiePolicyUrl?: string;

	// The maximum recommended length for an auto-generated quote's text.
	//
	// Example: 120
	//
	generatedQuoteMaxLength?: number;

	// The "min fit factor" that gets applied to the maximum recommended length for an auto-generated quote's text.
	// Defines how short the auto-generated quote text can be.
	//
	// Example: 0.5
	//
	generatedQuoteMinFitFactor?: number;

	// The "max fit factor" that gets applied to the maximum recommended length for an auto-generated quote's text.
	// Defines how long the auto-generated quote text can be.
	//
	// Example: 1.4
	//
	generatedQuoteMaxFitFactor?: number;

  // (on thread pages) The maximum length of a thread comment (in "points")
  // until a preview is generated for it and a "Read more" button is shown.
  // Is `1000` "points" by default.
	//
  // Example: 1000
	//
	commentLengthLimit?: number;

  // (on board pages) The maximum length of a thread comment (in "points")
  // until a preview is generated for it and a "Read more" button is shown.
  // Is `500` "points" by default.
	//
  // Example: 500
	//
	commentLengthLimitForThreadPreview?: number;

  // (on board pages when using tile layout)
  // The maximum length of a thread comment (in "points")
  // until a preview is generated for it and a "Read more" button is shown.
  // Is `200` "points" by default.
	//
  // Example: 200
	//
	commentLengthLimitForThreadPreviewForTileLayout?: number;

  // Maxumum allowed width for comment "thumbnail", in pixels.
  //
  // Comment "thumbnail" is one of the comment's attachments, if there're any,
  // that is used as a "main" picture representing that comment.
  //
  // For example, if a comment has several pictures attached,
  // one is chosen which is then displayed to the left of the comment's content.
  // The rest of the pictures would just be displayed at the bottom of the comment's content
  //
  commentThumbnailMaxWidth: number;

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
  // Example: "slow"
	//
	dataPollingRate?: DataPollingRate;

  // The fetched list of channels is cached in order to reduce
  // the load on the server.
  // By default, it caches the list of channels for one day.
	//
  // Example: 86400000
	//
	channelsCacheTimeout?: number;

  // Additional backgrounds (Dark mode).
	//
	// Example:
	//
	// [{
	// 	"id": "purple",
	// 	"name": "Purple",
	// 	"backgroundColor": "hsl(259, 45%, 11%)",
	// 	"gradientColor1": "hsl(19deg 27% 17%)",
	// 	"gradientColor2": "hsl(284deg 46% 21%)",
	// 	"gradientAngle": 90,
	// 	"patternOpacity": 0.15,
	// 	// If these two properties aren't defined, the default pattern picture is used.
	// 	"patternUrl": "/domain.com/image.svg",
	// 	"patternSize": "10em"
	// }]
	//
	backgroundsDarkMode?: Background[];

  // Default background `id` (Dark mode).
	//
  // Example: "purple"
	//
	defaultBackgroundDarkMode?: string;

  // Additional backgrounds (Light mode).
	//
	// Example:
	//
	// [{
	// 	"id": "orange-purple",
	// 	"name": "Orange Purple",
	// 	"gradientColor1": "hsl(34deg 53% 66%)",
	// 	"gradientColor2": "hsl(0deg 46% 70%)",
	// 	// If these two properties aren't defined, the default pattern picture is used.
	// 	"patternUrl": "url('/path/to/image.svg')",
	// 	"patternSize": "10em"
	// }]
	//
	backgroundsLightMode?: Background[];

  // Default background `id` (Light mode).
	//
  // Example: "orange-purple"
	//
	defaultBackgroundLightMode?: string;

  // Additional themes.
	//
	// Example:
	//
	// [{
	// 	"id": "yellow-sea",
	// 	"name": "Yellow Sea",
	// 	"url": "https://yellow.sea/style.css"
	// }]
	//
	themes?: Theme[];

  // Default theme `id`.
	//
  // Example: "yellow-sea"
	//
	defaultTheme?: string;

  // When the user goes to "Settings" page, they can modify the application's settings.
  // By default, there're already some settings pre-selected.
  // Those settings are called "default application settings".
  // To customize those "default application settings" for all users,
  // one can supply this `defaultSettings` configuration parameter:
  // any properies from it will override the ones defined in the "default application settings".
	//
	// Example:
	//
  // "defaultSettings": {
  //   "censorWords": false
  // }
	//
	defaultSettings?: UserSettingsJson;

  // Custom "default censored words".
  // Any "default censored words" defined for the languages here
  // override the default "default censored words" for those languages.
	//
	// Example:
	//
  // "defaultCensoredWords": {
  //   "en": [
  //     "^cocksuck.*",
  //     ...
  //   ]
  // }
	//
	defaultCensoredWords?: Record<string, string[]>
}

export type DataPollingRate = 'normal' | 'slow';