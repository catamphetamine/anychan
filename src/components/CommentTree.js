import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'

import CommentTree_ from 'webapp-frontend/src/components/CommentTree'
import Comment from './Comment/CommentWrapped'

import './CommentTree.css'

export default function CommentTree({
	state,
	// `onHeightChange()` is supplied by `virtual-scroller`.
	onHeightChange,
	// `onStateChange()` is supplied by `virtual-scroller`.
	onStateChange,
	getCommentById,
	...rest
}) {
	const getCommentComponentProps = useCallback(({ initialState, setState }) => {
		return {
			initialShowReplyForm: initialState.showReplyForm,
			onToggleShowReplyForm: (value) => setState((state) => ({
				...state,
				showReplyForm: value
			})),
			initialExpandContent: initialState.expandContent,
			onExpandContent: () => setState((state) => ({
				...state,
				expandContent: true
			})),
			initialExpandPostLinkQuotes: initialState.expandPostLinkQuotes,
			// `postLink._id`s are set in `enumeratePostLinks()`
			// in `./src/api/utility/addCommentProps.js`.
			// They're used instead of simply `postLink.postId`
			// because, for example, a comment could have several
			// `post-link`s to the same post, consequtive or
			// in different parts of its content.
			onPostLinkQuoteExpand: (postLink) => setState((state) => ({
				...state,
				expandPostLinkQuotes: {
					...(state && state.expandPostLinkQuotes),
					[postLink._id]: true
				}
			})),
			onRenderedContentDidChange: () => {
				if (onHeightChange) {
					onHeightChange()
				}
			},
			getCommentById
		}
	}, [
		onHeightChange,
		getCommentById
	])

	// This function is called when a replies tree for a comment is expanded.
	const onShowReply = useCallback((comment) => {
		comment.parseContent({ getCommentById })
	}, [getCommentById])

	return (
		<CommentTree_
			{...rest}
			initialState={state}
			onStateChange={onStateChange}
			onDidToggleShowReplies={onHeightChange}
			onShowReply={onShowReply}
			component={Comment}
			getComponentProps={getCommentComponentProps}/>
	)
}

CommentTree.propTypes = {
	state: PropTypes.object,
	// `onHeightChange()` is supplied by `virtual-scroller`.
	onHeightChange: PropTypes.func,
	// `onStateChange()` is supplied by `virtual-scroller`.
	onStateChange: PropTypes.func,
	getCommentById: PropTypes.func,
	dialogueChainStyle: PropTypes.oneOf(['through', 'side'])
}

CommentTree.defaultProps = {
	// `<InReplyToModal/>` passes `dialogueChainStyle="side"`.
	dialogueChainStyle: 'through'
}