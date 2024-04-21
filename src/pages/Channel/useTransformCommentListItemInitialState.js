import { useCallback } from 'react'

import { getShowRepliesState } from 'social-components-react/components/CommentTree.js'

export default function useTransformCommentListItemInitialState({
	channelLayout
}) {
	return useCallback((itemState, item) => {
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