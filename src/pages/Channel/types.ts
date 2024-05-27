import type { GetCommentById, Messages, Locale, Thread, ChannelId, ThreadId, CommentId, ChannelPageVirtualScrollerItemState, ChannelSorting, ChannelLayout } from '@/types'

export type ItemState = ChannelPageVirtualScrollerItemState

interface CommonProps {
	mode: 'channel';
	hasVoting: boolean;
	channelId: ChannelId;
	locale: Locale;
	messages: Messages;
	onClick: (commentId: CommentId, threadId: ThreadId, channelId: ChannelId) => void;
	unreadCommentWatcher: {
		watch: (element: Element) => () => void
	};
	latestSeenThreadId?: ThreadId;
}

export interface VirtualScrollerItemComponentProps {
	channelLayout: ChannelLayout;
	channelSorting: ChannelSorting;
	commonProps: CommonProps;
}

export interface ItemComponentProps {
	thread: Thread;
	state: ItemState;
	setState: (itemState: ItemState) => void;
	onHeightDidChange: () => void;
	getCommentById: GetCommentById;
	commonProps: CommonProps,
	latestSeenThreadId?: ThreadId
}