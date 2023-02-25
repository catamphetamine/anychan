import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import CommentTree from '../../components/CommentTree.js'

import { comment as commentType, commentTreeState } from '../../PropTypes.js'

// Made `ThreadComment` a `React.memo()` to optimize
// `<VirtualScroller/>` re-rendering: when `comment` doesn't change,
// it shouldn't re-render.
//
const ThreadComment = React.memo(function({
	item: comment,
	state,
	setState,
	expandAttachments,
	className,
	...rest
}) {
	const initialState = useMemo(() => state, [])

	return (
		<CommentTree
			comment={comment}
			initialState={initialState}
			setState={setState}
			postDateLinkUpdatePageUrlToPostUrlOnClick={true}
			postDateLinkNavigateToPostUrlOnClick={false}
			expandAttachments={expandAttachments}
			className={classNames(className, {
				'Comment--expandAttachments': expandAttachments
			})}
			{...rest}
		/>
	)
})

ThreadComment.propTypes = {
	item: commentType.isRequired,
	state: commentTreeState,
	setState: PropTypes.func.isRequired
}

export default ThreadComment

// Debug.
// function detectChangedProperties(props) {
// 	const { children: comment } = props
// 	if (!window._ThreadComment_props) {
// 		window._ThreadComment_props = {}
// 	}
// 	if (window._ThreadComment_props[comment.id]) {
// 		for (const key in props) {
// 			if (window._ThreadComment_props[comment.id][key] !== props[key]) {
// 				console.log('comment', comment.id, 'changed property', key, 'from', window._ThreadComment_props[comment.id][key], 'to', props[key])
// 			}
// 		}
// 	}
// 	window._ThreadComment_props[comment.id] = props
// }