import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import {
	setVirtualScrollerState,
	setScrollPosition
} from '../../redux/thread.js'

import ThreadComment from './ThreadComment.js'
import CommentsList from '../../components/CommentsList.js'

import { thread, comment } from '../../PropTypes.js'

import useRenderComments from './useRenderComments.js'

export default function ThreadCommentsList({
	searchQuery,
	thread,
	shownComments,
	itemComponentProps,
	getCommentById,
	...rest
}) {
	const {
		virtualScrollerState: initialVirtualScrollerState,
		scrollPosition: initialScrollPosition
	} = useSelector(state => state.thread)

	// `renderComments()` is called whenever there's a "parent" comment
	// whose `content` did change (for example, when a YouTube video link got loaded),
	// and so such "parent" comment update should trigger a "re-render" of all comments
	// that quote this "parent" comment, because those quotes have been re-generated.
	// `renderComments(commentIds)` does that: re-renders descendant comments by their IDs.
	const renderComments = useRenderComments({ shownComments })

	const itemComponentProps_ = useMemo(() => ({
		...itemComponentProps,
		renderComments
	}), [
		itemComponentProps,
		renderComments
	])

	if (searchQuery) {
		return (
			<CommentsList
				key="searchResults"
				mode="thread"
			/>
		)
	}

	if (shownComments.length > 0) {
		return (
			<CommentsList
				key="comments"
				mode="thread"
				initialState={initialVirtualScrollerState}
				setState={setVirtualScrollerState}
				initialScrollPosition={initialScrollPosition}
				setScrollPosition={setScrollPosition}
				items={shownComments}
				itemComponent={ThreadComment}
				itemComponentProps={itemComponentProps_}
				getCommentById={getCommentById}
				{...rest}
			/>
		)
	}

	return null
}

ThreadCommentsList.propTypes = {
	searchQuery: PropTypes.string,
	thread: thread.isRequired,
	shownComments: PropTypes.arrayOf(comment).isRequired,
	itemComponentProps: PropTypes.object.isRequired,
	getCommentById: PropTypes.func.isRequired
}