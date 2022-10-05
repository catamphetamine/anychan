import React, { useCallback, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import classNames from 'classnames'
import VirtualScroller from 'virtual-scroller/react'
import { isInstantBackAbleNavigation } from 'react-pages'

import './CommentsList.css'

function CommentsList({
	mode,
	initialState,
	setState,
	initialScrollPosition,
	setScrollPosition,
	getCommentById,
	stateRef,
	className,
	...rest
}) {
	const _stateRef = useRef()
	const virtualScrollerState = stateRef || _stateRef
	const onVirtualScrollerStateChange = useCallback(
		state => virtualScrollerState.current = state,
		[]
	)

	const scrollPosition = useRef()
	const onScrollPositionChange = useCallback(
		scrollY => scrollPosition.current = scrollY,
		[]
	)

	// `onItemInitialRender` property of `<VirtualScroller/>` shouldn't change
	// because `<VirtualScroller/>` doesn't support handling changes of such properties.
	// That means that `getCommentById()` shouldn't change too.
	const onItemInitialRender = useCallback(
		item => getComment(item, mode).parseContent({ getCommentById }),
		[mode, getCommentById]
	)

	const dispatch = useDispatch()

	useEffect(() => {
		return () => {
			if (isInstantBackAbleNavigation()) {
				if (setState) {
					// Save `virtual-scroller` state in Redux state.
					dispatch(setState(virtualScrollerState.current))
				}
				if (setScrollPosition) {
					// Save scroll position in Redux state.
					dispatch(setScrollPosition(scrollPosition.current))
				}
			}
		}
	}, [])

	return (
		<VirtualScroller
			{...rest}
			bypass={typeof window === 'undefined'}
			className={classNames(className, 'CommentsList')}
			initialState={initialState}
			onStateChange={onVirtualScrollerStateChange}
			initialScrollPosition={initialScrollPosition}
			onScrollPositionChange={onScrollPositionChange}
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
	initialScrollPosition: PropTypes.number,
	setScrollPosition: PropTypes.func,
	getCommentById: PropTypes.func,
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