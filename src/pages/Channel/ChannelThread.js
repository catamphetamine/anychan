import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import Comment from '../../components/Comment/CommentAndStuff.js'
import CommentTree from '../../components/CommentTree.js'

import getUrl from '../../utility/getUrl.js'

const ChannelThread = ({
	state,
	onStateChange,
	onHeightChange,
	item: thread,
	channelView,
	commonProps
}) => {
	const comment = thread.comments[0]

	const onExpandContentChange = useCallback((expandContent) => {
		onStateChange({
			expandContent
		})
	}, [
		onStateChange
	])

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

	const getOnClickUrl = useCallback((channelId, threadId, commentId) => {
		return getUrl(channelId, threadId, commentId)
	}, [])

	const initialState = useMemo(() => state, [])

	const getComponentProps = useCallback(() => {
		return {
			...commonProps,
			threadId: thread.id,
			getCommentById,
			getOnClickUrl,
			showRepliesCount: false,
			postDateLinkClickable: false,
			postDateLinkUpdatePageUrlToPostUrlOnClick: false,
			postDateLinkNavigateToPostUrlOnClick: false,
			toggleShowRepliesOnTreeBranchesClick: false
		}
	}, [
		commonProps,
		thread.id,
		getCommentById,
		getOnClickUrl
	])

	if (channelView === 'new-comments') {
		return (
			<CommentTree
				comment={comment}
				initialState={initialState}
				initialShowReplies
				onStateChange={onStateChange}
				onHeightChange={onHeightChange}
				getComponentProps={getComponentProps}
			/>
		)
	}

	// Properties `initialExpandContent` and `onExpandContentChange` are set here explicitly
	// because this component, unlike the corresponding component on a thread's page,
	//  isn't rendered by `<CommentTree/>` which adds those properties automatically.
	return (
		<Comment
			{...commonProps}
			comment={comment}
			threadId={thread.id}
			threadIsTrimming={thread.trimming}
			threadIsArchived={thread.archived}
			onRenderedContentDidChange={onHeightChange}
			getOnClickUrl={getOnClickUrl}
			initialExpandContent={state && state.expandContent}
			onExpandContentChange={onExpandContentChange}
		/>
	)
}

ChannelThread.propTypes = {
	item: PropTypes.object.isRequired,

	commonProps: PropTypes.object.isRequired,

	// `onStateChange()` property is provided by `virtual-scroller`.
	onStateChange: PropTypes.func.isRequired,

	// `onHeightChange()` property is provided by `virtual-scroller`.
	onHeightChange: PropTypes.func.isRequired,

	channelView: PropTypes.string,

	className: PropTypes.string
}

// Using `React.memo()` so that `virtual-scroller`
// doesn't needlessly re-render items as the user scrolls.
export default React.memo(ChannelThread)
