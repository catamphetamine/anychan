import type { ChannelLayout, Thread } from '@/types'

import { useCallback } from 'react'

import { getShowRepliesState } from 'social-components-react/components/CommentTree.js'

export default function useTransformCommentListItemInitialState({ channelLayout }: { channelLayout: ChannelLayout }) {
	return useCallback((itemState: Record<string, any>, item: Thread) => {
		if (channelLayout === 'threadsListWithLatestComments') {
			// If the thread is not hidden then show its latest comments.
			if (!itemState.hidden) {
				return {
					...itemState,
					...getShowRepliesState(item.comments[0])
				}
			}
		}
		return itemState
	}, [channelLayout])
}