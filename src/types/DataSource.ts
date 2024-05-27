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
	id: string;
	shortId: string;
	imageboard?: ImageboardId | ImageboardConfig;
	domain: string;
	domains?: string[];
	channelUrl: string;
	threadUrl: string;
	commentUrl: string;
	api: {
		getChannels: (parameters: GetChannelsParameters) => Promise<GetChannelsResult>,
		getThreads: (parameters: GetThreadsParameters) => Promise<GetThreadsResult>,
		getThread: (parameters: GetThreadParameters) => Promise<GetThreadResult>,
		voteForComment: (parameters: VoteForCommentParameters) => Promise<VoteForCommentResult>,
		logIn: (parameters: LogInParameters) => Promise<LogInResult>,
		logOut: (parameters: LogOutParameters) => Promise<LogOutResult>,
		createComment: (parameters: CreateCommentParameters) => Promise<CreateCommentResult>,
		createThread: (parameters: CreateThreadParameters) => Promise<CreateThreadResult>,
		getCaptcha: (parameters: GetCaptchaParameters) => Promise<GetCaptchaResult>,
		reportComment: (parameters: ReportCommentParameters) => Promise<ReportCommentResult>
	};
	hidden?: boolean;
	hiddenReason?: string;
	supportsFeature: (feature: string) => boolean;
	getCaptchaFrameUrl?: (parameters: { channelId?: ChannelFromDataSource['id'], threadId?: ThreadFromDataSource['id'] }) => string | undefined;
	captchaFrameUrlHasContentSecurityPolicy?: boolean;
	getAbsoluteUrl: (relativeUrl: string, parameters?: { notSafeForWork?: boolean }) => string;
	supportsCreateThread: () => boolean;
	supportsCreateComment: () => boolean;
	supportsReportComment: () => boolean;
	supportsLogIn: () => boolean;
	supportsVote: () => boolean;
	supportsGetCaptcha: () => boolean;
	isCaptchaRequired?: (params: {
		action: 'create-comment' | 'create-thread' | 'report-comment',
		isAuthenticated: boolean
	}) => boolean | undefined;
	hasLogInTokenPassword: () => boolean;
	getChannelRulesUrl?: (channelId: ChannelId) => string;
	reportReasons?: ReportReason[];
	reportReasonForLegalViolation?: ReportReason;
	icon: any;
	logo: any;
	title: string;
	subtitle?: string;
	description?: Content;
	language?: string;
	footnotes?: string;
	links?: { url: string, text: string }[];
	aliases?: string[];
	manifestUrl: string;
	contentCategories?: string[];
	contentCategoryUnspecified?: string;
	errorPages?: Record<string, StatusErrorPage>;
}

interface StatusErrorPage {
	images?: string[];
}

export interface GetChannelsParameters extends DataSourceReadApiCommonParameters {
	all?: boolean;
}

export interface GetChannelsResult {
	channels: ChannelFromDataSource[];
	hasMoreChannels?: boolean;
}

export interface GetThreadsParameters extends DataSourceReadApiCommonParameters {
	channelId: ChannelFromDataSource['id'];
	channelLayout: ChannelLayout;
	withLatestComments?: boolean;
	sortByRating?: boolean;
	// `dataSourceId` parameter is used in `src/api/imageboard/getThreads.js`.
	dataSourceId: DataSource['id'];
}

export interface GetThreadsResult {
	threads: ThreadFromDataSource[];
	hasMoreThreads?: boolean;
	channel?: ChannelFromDataSource;
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
	// `afterCommentId`/`afterCommentsCount` feature isn't currently used,
	// though it could potentially be used in some hypothetical future.
	// It would enable fetching only the "incremental" update
	// for the thread instead of fetching all of its comments.
	afterCommentId?: CommentFromDataSource['id'];
	afterCommentsCount?: number;
}

export interface GetThreadResult {
	thread: ThreadFromDataSource;
	hasMoreComments?: boolean;
	channel?: ChannelFromDataSource;
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

export interface VoteForCommentParameters extends DataSourceApiCommonParameters {
	channelId: ChannelFromDataSource['id'];
	threadId: ThreadFromDataSource['id'];
	commentId: CommentFromDataSource['id'];
	up: boolean;
}

export type VoteForCommentResult = boolean;

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

export interface CreateThreadParameters extends CreateThreadOrCommentCommonParameters {
}

export interface CreateThreadResult {
	id: ThreadFromDataSource['id'];
}

export interface ReportCommentParameters extends DataSourceApiCommonParameters {
	channelId: ChannelFromDataSource['id'];
	threadId: ThreadFromDataSource['id'];
	commentId: CommentFromDataSource['id'];
	content?: string;
	reasonId?: number | string;
	legalViolationReasonId?: number;
	captchaId?: string;
	captchaSolution?: string;
}

export type ReportCommentResult = void;

interface DataSourceApiCommonParameters {
	proxyUrl: string;
}

interface DataSourceReadApiCommonParameters extends DataSourceApiCommonParameters {
	locale: Locale;
	originalDomain?: string;
}

type ReportReason = {
	id: number | string,
	description: string,
	channelIds?: ChannelId[]
}