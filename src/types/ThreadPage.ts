import type { Thread, Comment, CommentTreeItemStateWithReplyAbility } from './index.js'

export interface RefreshParameters {
	onRefreshDelayed?: (delay: number) => void;
	onRefreshCancelled?: () => void;
	onRefreshFinished?: (thread: Thread) => void;
}

export type RefreshThread = (refreshParameters?: RefreshParameters) => void;

export type ThreadNavigationHistory<CommentState = CommentTreeItemStateWithReplyAbility> = {
	comment: Comment,
	state?: CommentState
}[];