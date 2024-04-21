import React, { useCallback, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import classNames from 'classnames'
import VirtualScroller from 'virtual-scroller/react'
import { useNavigationStartEffect, isInstantBackAbleNavigation } from 'react-pages'

import './CommentsList.css'

function CommentsList({
	mode,
	initialState,
	setState,
	getCommentById,
	transformInitialItemState,
	stateRef,
	className,
	...rest
}) {
	// `virtual-scroller` state.
	const _stateRef = useRef()
	const virtualScrollerState = stateRef || _stateRef
	const onVirtualScrollerStateChange = useCallback(
		state => virtualScrollerState.current = state,
		[]
	)

	// Returns an initial state for a `virtual-scorller` item.
	const getInitialItemState = useCallback((item) => {
		return getCommentsListItemInitialState(item, {
			mode,
			transformInitialItemState
		})
	}, [
		mode,
		transformInitialItemState
	])

	// `onItemInitialRender` property of `<VirtualScroller/>` shouldn't change
	// because `<VirtualScroller/>` doesn't support handling changes of such properties.
	// That means that `getCommentById()` shouldn't change too.
	const onItemInitialRender = useCallback(
		(item) => {
			onCommentInitialRender(item, { mode, getCommentById })
		},
		[mode, getCommentById]
	)

	const dispatch = useDispatch()

	// Saves `virtual-scroller` state in Redux on navigate away from the page
	// in case the user decides to navigate "Back" to this page.
	useNavigationStartEffect(() => {
		// console.log(`* On navigate from ${mode} page`)
		if (isInstantBackAbleNavigation()) {
			if (setState) {
				// Save `virtual-scroller` state in Redux state.
				dispatch(setState(virtualScrollerState.current))
			}
		}
	})

	return (
		<VirtualScroller
			{...rest}
			key={mode}
			bypass={typeof window === 'undefined'}
			className={classNames(className, 'CommentsList')}
			initialState={initialState}
			getInitialItemState={getInitialItemState}
			onStateChange={onVirtualScrollerStateChange}
			onItemInitialRender={onItemInitialRender}
			getItemId={getCommentId}
			measureItemsBatchSize={12}
		/>
	)
}

CommentsList.propTypes = {
	mode: PropTypes.oneOf(['channel', 'thread']).isRequired,
	initialState: PropTypes.object,
	setState: PropTypes.func,
	getCommentById: PropTypes.func,
	transformInitialItemState: PropTypes.func,
	stateRef: PropTypes.object,
	className: PropTypes.string
}

export default CommentsList

// This function is used in `virtual-scroller`
// to get an ID of an item.
function getCommentId(comment) {
	return comment.id
}

function getComment(item, mode) {
	switch (mode) {
		case 'channel':
			return item.comments[0]
		case 'thread':
			return item
		default:
			throw new Error(`Unknown <CommentsList/> "mode": ${mode}`)
	}
}

function createGetCommentByIdForLatestComments(thread) {
	return (commentId) => {
		if (commentId === thread.comments[0].id) {
			return thread.comments[0]
		}
		for (const otherLatestComment of thread.latestComments) {
			if (otherLatestComment.id === commentId) {
				return otherLatestComment
			}
		}
		// A comment with ID `commentId` might not be present
		// in the list of "latest comments" because that list
		// is just a "peek".
	}
}

// This function should be called on a `thread` or a `comment` object
// when it's about to be rendered for the first time.
// This function is "idempotent" meaning that it could be called multiple times
// with no futher effect.
export function onCommentInitialRender(item, {
	mode,
	getCommentById
}) {
	const comment = getComment(item, mode)

	// Parse comment content.
	comment.parseContent({ getCommentById })

	// Also parse the "latest comments" if the user is viewing a list of threads on a channel's page.
	if (mode === 'channel') {
		const thread = item
		if (thread.latestComments) {
			for (const latestComment of thread.latestComments) {
				latestComment.parseContent({
					getCommentById: createGetCommentByIdForLatestComments(thread)
				})
			}
		}
	}
}

// Returns an initial state for a `<CommentsList/>` item.
export function getCommentsListItemInitialState(item, {
	mode,
	ignoreHiddenState,
	transformInitialItemState
}) {
	let itemState = {}
	if (!ignoreHiddenState) {
		itemState.hidden = mode === 'channel' ? item.comments[0].hidden : item.hidden
	}
	if (transformInitialItemState) {
		itemState = transformInitialItemState(itemState, item)
	}
	return itemState
}