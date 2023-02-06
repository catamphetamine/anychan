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

import useReRenderCommentsByIds from './useReRenderCommentsByIds.js'

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
	//
	// `renderComments(commentIds)` only works as intended when all of the `commentIds`
	// are currently rendered on the page. That might not be the case when using `virtual-scroller`.
	// But there seems to be no better solution, and in the particular case of using this
	// `renderComments(commentIds)` function for updating the replies of a comment who had
	// some of its "resource links" loaded (for example, by transforming YouTube hyperlinks
	// into embedded `video`s) it works in most of the cases because:
	// * "resource links" are loaded only the first time a comment gets rendered.
	// * The list of comments is always rendered top-to-bottom meaning that top comments
	//   always get initially rendered before any of the bottom comments.
	//
	// So even if there could be any hypothetical inconsistencies in measuring such
	// comments' heights, those cases would be extremely rare and the `virtual-scroller`
	// would restore its proper operation by simply re-measuring those comments and
	// printing a warning in the console.
	//
	const renderComments = useReRenderCommentsByIds({ shownComments })

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