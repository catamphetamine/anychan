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
			initialExpandPostLinkQuotes: getState() && getState().expandPostLinkQuotes,
			// `postLink._id`s are set in `enumeratePostLinks()`
			// in `./src/api/utility/addCommentProps.js`.
			// They're used instead of simply `postLink.postId`
			// because, for example, a comment could have several
			// `post-link`s to the same post, consequtive or
			// in different parts of its content.
			onPostLinkQuoteExpand: (postLink) => updateState({
				expandPostLinkQuotes: {
					...(getState() && getState().expandPostLinkQuotes),
					[postLink._id]: true
				}
			}),
			onContentDidChange: onHeightChange
		}
	}, [onHeightChange])

	const [showReplies, setShowReplies] = useState()

	return (
		<CommentTree_
			dialogueChainStyle="through"
			{...rest}
			initialState={state}
			onStateChange={onStateChange ? onSubtreeStateChange : undefined}
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
	onStateChange: PropTypes.func
}

function onShowReply(comment) {
	if (!comment.contentParsed) {
		comment.parseContent()
	}
}