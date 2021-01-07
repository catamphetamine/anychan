import React from 'react'
import PropTypes from 'prop-types'

import CommentTree from '../../components/CommentTree'



import isEqual from 'lodash/isEqual'




// `ThreadComment` is required to be a `Component`
// in order to be `ref`-able inside `virtual-scroller`
// in order for `.renderItem(i)` to be able to call its `.forceUpdate()`.
// (`.renderItem(i)` is called in `renderComment()` function).
//
// Made `ThreadComment` a `PureComponent` to optimize
// `<VirtualScroller/>` re-rendering: when `comment` doesn't change,
// it shouldn't re-render.
//
export default class ThreadComment extends React.PureComponent {
	render() {
		const {
			children: comment,
			...rest
		} = this.props
		return (
			<CommentTree
				key={comment.id}
				comment={comment}
				{...rest}/>
		)
	}
}

ThreadComment.propTypes = {
	children: PropTypes.object.isRequired
}

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