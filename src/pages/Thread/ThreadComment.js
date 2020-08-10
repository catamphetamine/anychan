import React from 'react'
import PropTypes from 'prop-types'

import CommentTree from '../../components/CommentTree'

// `ThreadComment` is required to be a `Component`
// in order to be `ref`-able inside `virtual-scroller`
// in order for `.renderItem(i)` to be able to be called.
// Made it a `PureComponent` to optimize `<VirtualScroller/>` re-rendering.
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