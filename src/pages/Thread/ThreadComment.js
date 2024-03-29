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
	// `state` property is passed by `virtual-scroller`.
	state,
	// `setState` property is passed by `virtual-scroller`.
	setState,
	// Any `itemComponentProps` that were passed to `virtual-scroller`.
	...rest
}) {
	// `<CommentTree/>` uses the initial `state` to create its internal state.
	// After that, it doesn't read the `state` and uses its internal one instead.
	// Whenever its internal state changes, it calls `setState()` function
	// to sync the external `state` with the internal one.
	const initialState = useMemo(() => state, [])

	return (
		<CommentTree
			comment={comment}
			initialState={initialState}
			setState={setState}
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