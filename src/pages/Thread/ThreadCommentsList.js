import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import {
	setVirtualScrollerState
} from '../../redux/thread.js'

import ThreadComment from './ThreadComment.js'
import CommentsList from '../../components/CommentsList.js'

import { thread, comment } from '../../PropTypes.js'

export default function ThreadCommentsList({
	thread,
	shownComments,
	getCommentById,
	...rest
}) {
	const {
		virtualScrollerState: initialVirtualScrollerState
	} = useSelector(state => state.thread)

	if (shownComments.length > 0) {
		return (
			<CommentsList
				key="comments"
				mode="thread"
				initialState={initialVirtualScrollerState}
				setState={setVirtualScrollerState}
				items={shownComments}
				itemComponent={ThreadComment}
				getCommentById={getCommentById}
				{...rest}
			/>
		)
	}

	return null
}

ThreadCommentsList.propTypes = {
	thread: thread.isRequired,
	shownComments: PropTypes.arrayOf(comment).isRequired,
	getCommentById: PropTypes.func.isRequired
}