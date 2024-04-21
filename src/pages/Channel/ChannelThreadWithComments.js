import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'

import { thread as threadType, commentTreeState } from '../../PropTypes.js'

import CommentTree from '../../components/CommentTree.js'

import useGetCommentById from '../Thread/useGetCommentById.js'

export default function ChannelThreadWithComments({
	thread,
	state,
	setState,
	onHeightDidChange,
	commonProps,
	getCommentById
}) {
	const initialState = useMemo(() => state, [])

	const {
		id: threadId,
		isFirstThreadInTheList
	} = thread

	const getComponentProps = useCallback(() => {
		return {
			...commonProps,
			threadId,
			isFirstThreadInTheList,
			showRepliesCount: false,
			postDateLinkClickable: false,
			postDateLinkUpdatePageUrlToPostUrlOnClick: false,
			postDateLinkNavigateToPostUrlOnClick: false,
			toggleShowRepliesOnTreeBranchesClick: false,
			showSeparatorLineBetweenTopLevelComments: false
		}
	}, [
		commonProps,
		// * `thread` object reference will change on a thread page when auto-refreshing a thread.
		// * `thread` object reference is not supposed to change on a channel page.
		threadId,
		isFirstThreadInTheList
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
			onHeightDidChange={onHeightDidChange}
			getComponentProps={getComponentProps}
			getCommentById={getCommentById}
		/>
	)
}

ChannelThreadWithComments.propTypes = {
	thread: threadType.isRequired,

	state: commentTreeState,

	// `setState()` property is provided by `virtual-scroller`.
	setState: PropTypes.func.isRequired,

	// `onHeightDidChange()` property is provided by `virtual-scroller`.
	onHeightDidChange: PropTypes.func.isRequired,

	commonProps: PropTypes.object
}