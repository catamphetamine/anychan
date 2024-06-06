import type { Content } from 'social-components';

import type {
	ImageboardId,
	ImageboardConfig
} from 'imageboard'

import type {
	Locale,
	Captcha,
	ChannelFromDataSource,
	ThreadFromDataSource,
	CommentFromDataSource,
	Thread,
	ChannelLayout,
	ChannelId
} from './index.js';

export interface DataSource {
  // Data source's unique ID.
	// Example: "4chan".
	id: string;

  // Data source's unique single-character ID.
  //
  // This is currently only used on the demo site
  // as a prefix for storing data-source-specific data
  // in a web browser's `localStorage`:
  // longer prefixes occupy more space on the disk
  // so a short single-character emoji is used instead.
  //
  // For example, storing "latest read comment" ID
  // for each thread of `4chan` on the demo site
  // is achieved by storing records with keys like
  // `⌨️🍀/votes/a/12345` and values like `[{ 12367: -1 }]`.
  // For every thread there would be a separate record
  // so a shorter record key is preferred.
  //
	// Example: "🍀".
	//
	shortId: string;

	// If this data source is an imageboard, this is gonna be the imageboard ID or the imageboard config.
	imageboard?: ImageboardId | ImageboardConfig;

  // Data source's domain name.
	// Example: "4chan.org".
	domain: string;

  // Most data sources use "relative" URLs for attachments.
  // And some of them also have "backup" domains in case
  // their primary domain name is blocked by the authorities.
  // Because `anychan` can run on any domain name,
  // it requires a way to determine whether it is
  // running on a "legitimate" data source domain name
  // in order to decide whether it should leave those attachment
  // URLs as they are (being relative URLs, like "/images/abc.jpg")
  // or convert those  attachment URLs from relative URLs to
  // absolute URLs (like "https://website.net/images/abc.jpg"),
  // otherwise those URLs wouldn't work (for obvious reasons).
  // So, when `anychan` is hosted not on the "main" domain
  // but rather on one of the "backup" domains, it should have
  // a way of knowing that it's still a "legitimate" domain
  // so that it could leave relative attachment URLs as they are.
  // For that, the `domains` data source configuration parameter exists:
  // it should list all legitimate "backup" domains of the data source.
  // The default domain name should also be included in the "domains" list.
	//
	// Example:
	//
  // [
  //   "kohlchan.net",
  //   "kohl.chan",
  //   "kohlchankxguym67.onion",
  //   "kohlchan7cwtdwfuicqhxgqx4k47bsvlt2wn5eduzovntrzvonv4cqyd.onion"
  // ]
	//
	domains?: string[];

	// API.
	api: {
		// Searches for channels by a search query.
		//
		// The search query could be an empty string.
		//
		findChannels?: (parameters: FindChannelsParameters) => Promise<FindChannelsResult>,

		// Returns a list of "top" channels.
		//
		// For example, it could return a list of 20 most "hot" channels, etc.
		//
		getTopChannels?: (parameters: GetTopChannelsParameters) => Promise<GetTopChannelsResult>,

		// Returns a complete list of all available channels, without pagination.
		//
		// This API mostly exists for legacy compatibility with "imageboards"
		// that only have a fixed list of about 10-20 discussion "boards".
		// On websites like Reddit there wouldn't be such API because the full list of channels would be too huge.
		//
		getChannels?: (parameters: GetChannelsParameters) => Promise<GetChannelsResult>,

		// Returns a list of threads on a given channel.
		//
		// This API could support pagination, although the list of properties for pagination hasn't been outlined yet.
		// There already is a `maxCount` parameter ("limit"). Theoretically, there could also exist a `page?: number` parameter
		// but the issue with that one would be that the list of threads may be highly dynamic rather than static
		// so just the page number wouldn't really work. Something like `afterThreadId` would've worked better,
		// but that'd only work for `sortBy: createdAt-desc` sorting and wouldn't really work with something like `sortBy: rating-desc`.
		//
		// Supports an optional `sortBy` parameter.
		//
		getThreads: (parameters: GetThreadsParameters) => Promise<GetThreadsResult>,

		// Searches for threads by a search query on a given channel.
		//
		// The search query could be an empty string.
		//
		findThreads?: (parameters: FindThreadsParameters) => Promise<FindThreadsResult>,

		// Returns thread data, including some or all of its comments.
		//
		// This API could support pagination via properties:
		// * maxCommentsCount — "limit"
		// * beforeCommentId — "<"
		// * afterCommentId — ">"
		// * fromCommentId — ">="
		// * uptoCommentId — "<="
		//
		getThread: (parameters: GetThreadParameters) => Promise<GetThreadResult>,

		// Searches for comments by a search query in a given thread on a given channel.
		//
		// If `threadId` is not specified then it should search across all threads on the channel.
		//
		// The search query could be an empty string.
		//
		findComments?: (parameters: FindCommentsParameters) => Promise<FindCommentsResult>,

		// Submits an upvote or a downvote for a comment.
		rateComment?: (parameters: RateCommentParameters) => Promise<RateCommentResult>,

		// Logs in a user.
		logIn?: (parameters: LogInParameters) => Promise<LogInResult>,

		// Logs out a user.
		logOut?: (parameters: LogOutParameters) => Promise<LogOutResult>,

		// Creates a new comment in a given thread.
		createComment?: (parameters: CreateCommentParameters) => Promise<CreateCommentResult>,

		// Updates a comment.
		updateComment?: (parameters: UpdateCommentParameters) => Promise<UpdateCommentResult>,

		// Creates a new thread in a given channel.
		createThread?: (parameters: CreateThreadParameters) => Promise<CreateThreadResult>,

		// Updates a thread.
		updateThread?: (parameters: UpdateThreadParameters) => Promise<UpdateThreadResult>,

		// Requests a CAPTCHA to solve.
		getCaptcha?: (parameters: GetCaptchaParameters) => Promise<GetCaptchaResult>,

		// Reports a comment.
		// To report a thread, report its "original" comment.
		reportComment?: (parameters: ReportCommentParameters) => Promise<ReportCommentResult>
	};

	// Whether this data source should be hidden from the list of supported ones.
	hidden?: boolean;
	// If this data source should be hidden from the list of supported ones,
	// a reason should be specified for that.
	hiddenReason?: string;

	// Tells whether the data source supports a certain feature.
	supportsFeature: (feature: DataSourceFeature) => boolean;

	// Some data sources don't allow embedding their CAPTCHA on 3rd-party websites.
	// In such cases, an `<iframe/>` with the CAPTCHA could potentially be rendered on such websites.
	getCaptchaFrameUrl?: (parameters: { channelId?: ChannelFromDataSource['id'], threadId?: ThreadFromDataSource['id'] }) => string | undefined;

	// Set to `true` if the CAPTCHA frame URL specifies a `Content-Security-Policy`
	// HTTP request header that restricts it from being used in an `<iframe/>`.
	captchaFrameUrlHasContentSecurityPolicy?: boolean;

	// Returns `true` if solving a CAPTCHA is known to be required for ceratin scenarios.
	// This way, the application could show the CAPTCHA modal to the user right away
	// when attempting such actions instead of first attempting to perform the action
	// and then re-trying with a CAPTCHA after it receives a "CAPTCHA required" error.
	isCaptchaRequired?: (params: {
		action: 'create-comment' | 'create-thread' | 'report-comment',
		isAuthenticated: boolean
	}) => boolean | undefined;

	// This flag could be set to `true` to prevent the application from converting relative attachment URLs
	// to absolute ones. For example, this flag is used with the `example` data source to prevent it from
	// converting relative attachment URLs to absolute ones because those URLs are meant to stay relative
	// because it's a "fake" data source.
	keepRelativeAttachmentUrls?: boolean;

	// Converts a possibly-relative URL to an absolute one.
	// The URL belongs to the data source's original website.
	// Example: "/a/res/12345.html" → "https://boards.4chan.org/a/res/12345.html".
	getAbsoluteUrl: (relativeUrl: string, parameters?: { notSafeForWork?: boolean }) => string;

	// Returns a URL that points to the document describing the rules for posting content at the data source.
	getRulesUrl?: (params?: { channelId?: ChannelId }) => string;

	// A list of available reasons to choose from when reporting a comment.
	reportReasons?: ReportReason[];
	// A report reason for reporting a violation of some law.
	reportReasonForLegalViolation?: ReportReason;

	// A URL of a *.png 128x128 icon for this data source.
	icon: string;

	// A URL of a *.png or a component for an *.svg square logo for this data source.
	logo: string | React.FC<React.SVGProps<SVGSVGElement>>;

	// The text that will be shown in the title of the home page of the application.
	title: string;

	// The text that is displayed under the data source's title on the home page.
	subtitle?: string;

	// The text that will be shown at the home page of the application.
	//
  // Can be a `String` or `InlineContent` (like text with hyperlinks):
  // https://gitlab.com/catamphetamine/social-components/-/blob/master/docs/Post/PostContent.md
	//
	// Example: "4chan is the oldest English-speaking imageboard"
	//
	description?: Content;

	// The primary language the content is written in at the data source.
	language?: string;

	// Optional content to include in the footer of the application.
	//
  // Can be a `String` or `InlineContent` (like text with hyperlinks):
  // https://gitlab.com/catamphetamine/social-components/blob/master/docs/Post/PostContent.md
	//
	// Example: "Copyright © 2003-2019 4chan community support LLC. All rights reserved."
	//
	footnotes?: Content;

	// A list of links to show in the footer of the application.
	//
  // The `type` property is optional and currently doesn't have any effect.
	//
	// Example:
	//
	// [{
	// 	"type": "rules",
	// 	"text": "Rules",
	// 	"url": "http://www.4chan.org/rules"
	// },
	// {
	// 	"type": "faq",
	// 	"text": "FAQ",
	// 	"url": "http://www.4chan.org/faq"
	// },
	// {
	// 	"type": "twitter",
	// 	"text": "Twitter",
	// 	"url": "https://twitter.com/4chan"
	// }]
	//
	links?: {
		type?: string,
		text: string,
		url: string
	}[];

	// Some data sources may have been renamed from their historical names,
	// in which case those could be referred by either name.
	// For example, when `8ch` was renamed to `8kun`, an alias was added.
	// Example: `["8kun"]`.
	aliases?: string[];

	// To support "Progressive Web Application" feature, this should be a URL of the `manifest.json` file.
	// https://developer.mozilla.org/ru/docs/Web/Manifest
	manifestUrl: string;

  // Channel URL template.
  // Example: "/r/{channelId}".
	channelUrl: string;

  // Thread URL template.
  // Example: "/r/{channelId}/comments/{threadId}".
	threadUrl: string;

  // Comment URL template.
  // Example: "/r/{channelId}/comments/{threadId}/thread-slug-autogenerated-from-title/{commentId}".
	commentUrl: string;

	// Certain data sources might prefer to list their channels that're grouped by category
	// in a certain order of the categories.
	// Example: ["Japanese Culture", "Video Games", ...].
	channelCategoriesOrder?: string[];

	// Any channels that belong to this `category` will be hidden in the list of channels in the sidebar.
	// The rationale is to reduce visual clutter.
	// Example: "Other".
	contentCategoryHidden?: string;

	// A data source might supply custom error-page images such as "404 Not Found" ones.
	// This is the parameter where those image URLs could be specified.
	//
	// Example:
	//
	// "errorPages": {
	// 	"404": {
	// 		"images": [
	// 			"https://s.4cdn.org/image/error/404/404-DanKim.gif",
	// 			"https://s.4cdn.org/image/error/404/404-Anonymous-3.png",
	// 			"https://s.4cdn.org/image/error/404/404-Anonymous-5.png",
	// 			"https://s.4cdn.org/image/error/404/404-Anonymous-6.png"
	// 		]
	// 	}
	// }
	//
	errorPages?: Record<string, StatusErrorPage>;
}

export type DataSourceWithoutResources = Omit<DataSource, 'icon' | 'logo'>

// Same as `DataSource` but excluding the properties that will be added automatically by the application.
// Should be used when defining a new data source.
export type DataSourceDefinition = Omit<DataSourceWithoutResources, 'manifestUrl' | 'getAbsoluteUrl'>
export type DataSourceDefinitionWithResources = DataSourceDefinition & Pick<DataSource, 'icon' | 'logo'>

export type ImageboardDataSourceDefinition = Omit<DataSourceDefinition,
	'api' |
	'domain' |
	'supportsFeature' |
	'channelUrl' |
	'threadUrl' |
	'commentUrl'
>

export type ImageboardDataSourceDefinitionWithResources = ImageboardDataSourceDefinition & Pick<DataSource, 'icon' | 'logo'>

interface StatusErrorPage {
	images?: string[];
}

export interface GetChannelsParameters extends DataSourceReadApiCommonParameters {
	maxCount?: number;
}

export interface GetChannelsResult {
	channels: ChannelFromDataSource[];
	hasMoreChannels?: boolean;
}

export interface GetTopChannelsParameters extends GetChannelsParameters {
}

export interface GetTopChannelsResult extends GetChannelsResult {
}

export interface FindChannelsParameters extends GetChannelsParameters {
	search: string;
}

export interface FindChannelsResult extends GetChannelsResult {
}

export interface GetThreadsParameters extends DataSourceReadApiCommonParameters {
	channelId: ChannelFromDataSource['id'];
	channelLayout: ChannelLayout;
	withLatestComments?: boolean;
	// Currently, `createdAt-desc` seems to be the default way of sorting threads.
	sortBy?: 'createdAt-desc' | 'rating-desc';
	maxCount?: number;
	// `dataSourceId` parameter is only used in `src/api/imageboard/getThreads.ts`
	// to work around `2ch.hk` bug on `/d/` board.
	dataSourceId: DataSource['id'];
}

export interface GetThreadsResult {
	threads: ThreadFromDataSource[];
	hasMoreThreads?: boolean;
	channel?: ChannelFromDataSource;
}

export interface FindThreadsParameters extends GetThreadsParameters {
	search: string;
}

export interface FindThreadsResult extends GetThreadsResult {
}

export interface GetThreadParameters extends DataSourceReadApiCommonParameters {
	channelId: ChannelFromDataSource['id'];
	threadId: ThreadFromDataSource['id'];
	archived?: boolean;
	// `threadBeforeRefresh` could be passed when refreshing a thread.
	// `threadBeforeRefresh` feature isn't current used, though it
	// could potentially be used in some hypothetical future.
	// It would enable fetching only the "incremental" update
	// for the thread instead of fetching all of its comments.
	threadBeforeRefresh?: Thread;
	// These parameters aren't currently used but could be used in some future
	// in case of implementing "incremental" thread fetching.
	// The reason is that historically `anychan` was written to support imageboard engines
	// that return the whole list of comments for a thread at once and don't provide
	// any "incremental" fetch API.
	// When potentially adding non-imageboard data sources in some future, the requirement
	// to support "incremental" fetch API might appear, in which case these properties could be used
	// for the implementation of the corresponding "adapters".
	afterCommentId?: CommentFromDataSource['id'];
	afterCommentNumber?: number;
	// These parameters aren't currently used either. They could also hypothetically be used
	// when impelmenting "incremental" fetching of thread comments.
	maxCommentsCount?: number;
	beforeCommentId?: CommentFromDataSource['id'];
	beforeCommentNumber?: number;
	fromCommentId?: CommentFromDataSource['id'];
	uptoCommentId?: CommentFromDataSource['id'];
}

export interface GetThreadResult {
	thread: ThreadFromDataSource;
	hasMoreComments?: boolean;
	channel?: ChannelFromDataSource;
}

export interface FindCommentsParameters extends DataSourceReadApiCommonParameters {
	channelId: ChannelFromDataSource['id'];
	// If `threadId` is not specified then it should search across all threads on the channel.
	threadId?: ThreadFromDataSource['id'];
	archived?: boolean;
}

export interface FindCommentsResult {
	comments: CommentFromDataSource[];
	hasMoreComments?: boolean;
	channel?: ChannelFromDataSource;
	thread?: ThreadFromDataSource;
}

export interface GetCaptchaParameters extends DataSourceReadApiCommonParameters {
	channelId?: ChannelFromDataSource['id'];
	threadId?: ThreadFromDataSource['id'];
}

export interface GetCaptchaResult {
	captcha: Captcha;
	canRequestNewCaptchaAt?: Date;
}

export interface LogInParameters extends DataSourceApiCommonParameters {
	token: string;
	// `4chan` uses "passwords" on login tokens.
	tokenPassword?: string;
}

export interface LogInResult {
	accessToken?: string;
}

export interface LogOutParameters extends DataSourceApiCommonParameters {}

export type LogOutResult = void;

export interface RateCommentParameters extends DataSourceApiCommonParameters {
	channelId: ChannelFromDataSource['id'];
	threadId: ThreadFromDataSource['id'];
	commentId: CommentFromDataSource['id'];
	up: boolean;
}

export type RateCommentResult = boolean;

export interface CreateThreadOrCommentCommonParameters extends DataSourceApiCommonParameters {
	channelId: ChannelFromDataSource['id'];
	authorIsThreadAuthor?: boolean;
	authorEmail?: string;
	authorName?: string;
	authorBadgeId?: number;
	attachments?: (File | Blob)[];
	title?: string;
	content?: string;
	accessToken?: string;
	captchaType?: string;
	captchaId?: string;
	captchaSolution?: string;
	tags?: string[];
}

export interface CreateCommentParameters extends CreateThreadOrCommentCommonParameters {
	threadId: ThreadFromDataSource['id'];
}

export interface CreateCommentResult {
	id: CommentFromDataSource['id'];
}

export interface UpdateCommentParameters extends CreateThreadOrCommentCommonParameters {
	threadId: ThreadFromDataSource['id'];
	commentId: CommentFromDataSource['id'];
}

export type UpdateCommentResult = void

export interface CreateThreadParameters extends CreateThreadOrCommentCommonParameters {
}

export interface CreateThreadResult {
	id: ThreadFromDataSource['id'];
}

export interface UpdateThreadParameters extends CreateThreadOrCommentCommonParameters {
	threadId: ThreadFromDataSource['id'];
}

export type UpdateThreadResult = void

export interface ReportCommentParameters extends DataSourceApiCommonParameters {
	channelId: ChannelFromDataSource['id'];
	threadId: ThreadFromDataSource['id'];
	commentId: CommentFromDataSource['id'];
	accessToken?: string;
	content?: string;
	reasonId?: number | string;
	legalViolationReasonId?: number;
	captchaId?: string;
	captchaSolution?: string;
}

export type ReportCommentResult = void;

interface DataSourceApiCommonParameters {
	// CORS proxy URL.
	//
	// Pass it to `createHttpRequestFunction({ proxyUrl })` to create a "send HTTP request" function.
	// If `proxyUrl` is passed to that function, it will proxy all HTTP requests through that proxy.
	// Otherwise, it won't use any proxy when sending HTTP requests.
	//
	proxyUrl: string | null;
}

interface DataSourceReadApiCommonParameters extends DataSourceApiCommonParameters {
	// The locale that is currently selected in the application.
	// Although I'd call it more of a "language" rather than a "locale"
	// because it doesn't contain the "region" part: it's just "en" rather than "en-US".
	//
	// The user's locale could be used to customize API response for a certain language.
	// For example, if the API replaces YouTube links with YouTube video titles,
	// it could use the locale to choose between the available titles in different languages.
	//
	// Examples: `"en"`, `"ru"`, etc.
	//
	locale: Locale;

	// If the application runs on one of the "original" domains of the data source,
	// the `originalDomain` is gonna be that "original" domain.
	//
	// For example, if this application was running somewhere at `https://4chan.org/anychan`
	// then the `originalDomain` would be `"4chan.org"`.
	//
	// A data source "adapter" could then use this `originalDomain` parameter
	// when deciding whether it should convert any relative URLs to absolute ones.
	//
	// For example, if `originalDomain` was `"4chan.org"` and images were also hosted at `4chan.org`
	// then those image URLs could be left relative like `"/images/image12345.jpg".
	// In other cases, any relative URLs should be manually converted to absolute ones
	// like `"https://4chan.org/images/image12345.jpg"` by the data source "adapter".
	//
	originalDomain: string | null;
}

type ReportReason = {
	id: number | string,
	description: string,
	channelIds?: ChannelId[]
}

export type DataSourceFeature =
	'getThread.withLatestComments' |
	'getThreads.sortByRatingDesc' |
	'logIn.tokenPassword'