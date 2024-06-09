import type { State as VirtualScrollerState } from 'virtual-scroller'
import type { Attachment } from 'social-components'
import type { Captcha, CaptchaFrame, Announcement, Channel, Thread, Comment, ChannelLayout, ChannelSorting, Background, SubscribedThread, UserSettingsJson, FavoriteChannel } from './index.js'
import type { ReactNode } from 'react'
import type { SlideshowSlide } from './index.js'

export interface EasyReactForm {
	focus(fieldName?: string): void;
	scroll(fieldName: string): any;
	clear(fieldName: string): any;
	get(fieldName: string): any;
	set(fieldName: string, value: any): void;
	watch(fieldName: string): Record<string, any> | undefined;
	values(): any;
	reset(): void;
	getElement(fieldName?: string): HTMLElement;
}

export type EasyReactFormState = Record<string, any>;

export interface CommentTreeItemState {
	expandContent?: boolean;
	expandPostLinkQuotes?: Record<string, boolean>;
	hidden?: boolean;
	replies?: CommentTreeItemState[];
}

export interface CommentTreeItemStateWithReplyAbility extends CommentTreeItemState {
	showReplyForm?: boolean;
	replyForm?: EasyReactFormState;
	replyFormError?: string;
	replyFormInputError?: string;
	replyFormInputHeight?: number;
	replyFormFiles?: { id: number, file: File }[];
	replyFormAttachments?: Attachment[];
	replies?: CommentTreeItemStateWithReplyAbility[];
}

export interface ChannelPageVirtualScrollerItemState extends CommentTreeItemState {}

export interface ThreadPageVirtualScrollerItemState extends CommentTreeItemStateWithReplyAbility {}

interface ChannelPageVirtualScrollerState extends VirtualScrollerState<Thread, ChannelPageVirtualScrollerItemState> {}

interface ThreadPageVirtualScrollerState extends VirtualScrollerState<Comment, ThreadPageVirtualScrollerItemState> {}

interface CommentFormCommonProperties {
	// `easy-react-form` state.
	form: EasyReactFormState;
	formError?: string;
	formInputHeight?: number;
	formFiles?: {
		file: File,
		id: number
	}[];
	formAttachments?: Attachment[];
}

export interface State {
	auth: {
		accessToken?: string
	};
	app: {
		dataSourceInfoForMeta?: {
			title: string,
			description: string,
			icon: string,
			language: string
		},
		isSidebarShown?: boolean,
		darkMode?: boolean,
		cookiesAccepted?: boolean,
		offline?: boolean,
		sidebarMode?: 'channels',
		showPageLoadingIndicator?: boolean,
		backgroundLightMode?: Background['id'],
		backgroundDarkMode?: Background['id']
	};
	announcement: {
		announcement?: Announcement & {
			read?: boolean
		}
	};
	channels: {
		// `channels.channels` will be `undefined` in "offline" mode.
		channels?: Channel[],
		channelsByCategory?: { category: string, channels: Channel[] }[],
		channelsSortedByPopularity?: Channel[]
	};
	channel: {
		channel?: Channel,
		threads?: Thread[]
	};
	thread: {
		channel?: Channel,
		thread?: Thread,
		threadFetchedAt?: number,
		threadFetchedBy?: 'auto-update',
		threadBeingFetched?: {
			channelId: Channel['id'],
			threadId: Thread['id']
		},
		threadIsBeingRefreshed?: boolean,
		autoUpdateFirstNewCommentIndex?: number,
		autoUpdateLastNewCommentIndex?: number,
		autoUpdateFirstNewCommentId?: Comment['id'],
		autoUpdateLastNewCommentId?: Comment['id'],
		autoUpdateUnreadCommentsCount?: number,
		autoUpdateUnreadRepliesCount?: number
	};
	threadPage: {
		virtualScrollerState?: ThreadPageVirtualScrollerState,
		fromIndex?: number,
		isInitialFromIndex?: boolean,
		initialLatestReadCommentIndex?: number,
		expandAttachments?: boolean,
		createCommentState?: CommentFormCommonProperties & {
			formExpanded?: boolean
		}
	};
	channelPage: {
		searchResultsState?: {
			searchResults: Thread[],
			searchQuery?: string
		},
		virtualScrollerState?: ChannelPageVirtualScrollerState,
		initialLatestSeenThreadId?: Thread['id'],
		channelLayout?: ChannelLayout,
		channelSorting?: ChannelSorting,
		createThreadState?: CommentFormCommonProperties & {
			showForm?: boolean
		},
		pinnedThreadsState?: {
			expandedThreadIds: Thread['id'][],
			expandedThreadStates: Record<string, {
				hidden?: boolean,
				replies?: {}[]
			}>
		},
		subscribedThreadIds?: Thread['id'][]
	};
	captcha: {
		showCaptchaModal?: boolean,
		captcha: Captcha | CaptchaFrame;
		canRequestNewCaptchaAt?: Date;
		captchaSubmitId?: string
	};
	favoriteChannels: {
		favoriteChannels: FavoriteChannel[]
	};
	notifications: {
		notification: {
			content?: ReactNode,
			type?: string
		}
	};
	report: {
		showReportCommentModal?: boolean,
		channel?: Channel,
		channelId?: Channel['id'],
		threadId?: Thread['id'],
		commentId?: Comment['id']
	};
	settings: {
		settings?: UserSettingsJson
	};
	slideshow: {
		isOpen?: boolean,
		slides?: SlideshowSlide[],
		index?: number,
		mode?: 'flow',
		goToSource?: (slide: SlideshowSlide) => void,
		imageElement?: Element
	};
	subscribedThreads: {
		subscribedThreads?: SubscribedThread[],
		subscribedThreadsUpdateInProgress?: boolean,
		subscribedThreadsUpdateChannelId?: Channel['id'],
		subscribedThreadsUpdateThreadId?: Thread['id']
		// subscribedThreadsUpdateInitial?: boolean
	};
	twitter: {
		tweetId?: string,
		tweetUrl?: string,
		isLoading?: boolean
	};
}

export type PageStateReducerName = 'channel' | 'thread' | 'channelPage' | 'threadPage'

export type NotificationContent = string | ReactNode

export interface NotificationOptions {}