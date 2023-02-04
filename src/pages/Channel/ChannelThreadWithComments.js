import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'

import { thread as threadType } from '../../PropTypes.js'

import CommentTree from '../../components/CommentTree.js'

export default function ChannelThreadWithComments({
	thread,
	state,
	setState,
	onHeightChange,
	commonProps
}) {
	const getCommentById = useCallback((commentId) => {
		if (thread.comments[0].id === commentId) {
			return thread.comments[0]
		}
		if (thread.latestComments) {
			for (const comment of thread.latestComments) {
				if (comment.id === commentId) {
					return comment
				}
			}
		}
	}, [thread])

	const initialState = useMemo(() => state, [])

	const getComponentProps = useCallback(() => {
		return {
			...commonProps,
			threadId: thread.id,
			showRepliesCount: false,
			postDateLinkClickable: false,
			postDateLinkUpdatePageUrlToPostUrlOnClick: false,
			postDateLinkNavigateToPostUrlOnClick: false,
			toggleShowRepliesOnTreeBranchesClick: false
		}
	}, [
		commonProps,
		thread.id
	])

	// `initialShowReplies` property is not used here
	// because there is always some `initialState`.
	// Example: `{ hidden: true/false }`.
	// Instead, `getShowRepliesState(comment)` function is used
	// when constructing that initial state.

	return (
		<CommentTree
			comment={thread.comments[0]}
			initialState={initialState}
			setState={setState}
			onHeightChange={onHeightChange}
			getComponentProps={getComponentProps}
			getCommentById={getCommentById}
		/>
	)
}

ChannelThreadWithComments.propTypes = {
	thread: threadType.isRequired,

	state: PropTypes.object,

	// `setState()` property is provided by `virtual-scroller`.
	setState: PropTypes.func.isRequired,

	// `onHeightChange()` property is provided by `virtual-scroller`.
	onHeightChange: PropTypes.func.isRequired,

	commonProps: PropTypes.object
}