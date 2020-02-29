import React, { useCallback } from 'react'
import PropTypes from 'prop-types'

import CommentTree from 'webapp-frontend/src/components/CommentTree'
import ThreadComment from './ThreadComment'

import './ThreadCommentTree.css'

export default function ThreadCommentTree({
	state,
	// `onHeightChange()` is supplied by `virtual-scroller`.
	onHeightChange,
	// `onStateChange()` is supplied by `virtual-scroller`.
	onStateChange,
	...rest
}) {
	const onSubtreeStateChange = useCallback((subtreeState) => {
		// console.log('@ Subtree state changed\n', JSON.stringify(subtreeState, null, 2))
		onStateChange(subtreeState)
	}, [onStateChange])

	const getCommentComponentProps = useCallback(({ getState, updateState }) => {
		return {
			initialShowReplyForm: getState() && getState().showReplyForm,
			onToggleShowReplyForm: (value) => updateState({ showReplyForm: value }),
			initialExpandContent: getState() && getState().expandContent,
			onExpandContent: () => updateState({ expandContent: true }),
			onContentDidChange: onHeightChange
		}
	}, [onHeightChange])

	return (
		<CommentTree
			{...rest}
			initialState={state}
			onStateChange={onStateChange ? onSubtreeStateChange : undefined}
			onDidToggleShowReplies={onHeightChange}
			onShowReply={onShowReply}
			component={ThreadComment}
			getComponentProps={getCommentComponentProps}/>
	)
}

ThreadCommentTree.propTypes = {
	state: PropTypes.object,
	// `onHeightChange()` is supplied by `virtual-scroller`.
	onHeightChange: PropTypes.func,
	// `onStateChange()` is supplied by `virtual-scroller`.
	onStateChange: PropTypes.func
}

function onShowReply(comment) {
	if (!comment.contentParsed) {
		comment.parseContent()
	}
}