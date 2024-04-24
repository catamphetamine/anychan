import type { ImageboardId, ImageboardConfig } from 'imageboard'

export interface DataSource {
	id: string;
	imageboard?: ImageboardId | ImageboardConfig;
	domain: string;
	domains?: string[];
	channelUrl: string;
	threadUrl: string;
	commentUrl: string;
	api: {
		voteForComment: Function,
		logIn: Function,
		logOut: Function,
		createComment: Function,
		createThread: Function,
		getCaptcha: Function,
		reportComment: Function,
		supportsFeature: (feature: string) => boolean
	};
	getCaptchaFrameUrl?: (parameters: { channelId: string, threadId?: string }) => string;
	getAbsoluteUrl: (relativeUrl: string, parameters?: { notSafeForWork?: boolean }) => string;
	supportsCreateThread: () => boolean;
	supportsCreateComment: () => boolean;
	supportsReportComment: () => boolean;
	supportsLogIn: () => boolean;
	supportsVote: () => boolean;
	supportsGetCaptcha: () => boolean;
	hasLogInTokenPassword: () => boolean;
	icon: any;
	logo: any;
	title: string;
	subtitle?: string;
	description: string;
	language?: string;
	footnotes?: string;
	links?: { url: string, text: string }[];
	aliases?: string[];
	manifestUrl: string;
	contentCategories?: string[];
}