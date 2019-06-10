import React from 'react'

import CommentTree from 'webapp-frontend/src/components/CommentTree'
import ThreadComment from './ThreadComment'

import './ThreadCommentTree.css'

export default class ThreadCommentTree extends React.Component {
	onSubtreeStateChange = (subtreeState) => {
		const { onStateChange } = this.props
		// console.log('@ Subtree state changed\n', JSON.stringify(subtreeState, null, 2))
		this.subtreeState = subtreeState
		onStateChange(this.subtreeState)
	}

	getCommentComponentProps = ({ getState, updateState }) => {
		const { onHeightChange } = this.props
		return {
			initialShowReplyForm: getState() && getState().showReplyForm,
			onToggleShowReplyForm: (value) => updateState({ showReplyForm: value }),
			initialExpandContent: getState() && getState().expandContent,
			onExpandContent: () => updateState({ expandContent: true }),
			onContentDidChange: onHeightChange
		}
	}

	render() {
		const {
			state,
			onHeightChange,
			...rest
		} = this.props
		return (
			<CommentTree
				{...rest}
				initialState={state}
				onStateChange={this.onSubtreeStateChange}
				onDidToggleShowReplies={onHeightChange}
				component={ThreadComment}
				getComponentProps={this.getCommentComponentProps}/>
		)
	}
}