import React, { useCallback, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import classNames from 'classnames'
import VirtualScroller from 'virtual-scroller/react'
import { isInstantBackAbleNavigation } from 'react-pages'

import './CommentsList.css'

function CommentsList({
	mode,
	initialCustomState,
	restoredState,
	setState,
	restoredScrollPosition,
	setScrollPosition,
	getCommentById,
	stateRef,
	className,
	...rest
}, ref) {
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
	const onItemInitialRender = useCallback(
		item => getComment(item, mode).parseContent({ getCommentById }),
		[mode, getCommentById]
	)
	const dispatch = useDispatch()
	useEffect(() => {
		return () => {
			if (isInstantBackAbleNavigation()) {
				// Save `virtual-scroller` state in Redux state.
				dispatch(setState(virtualScrollerState.current))
				// Save scroll position in Redux state.
				dispatch(setScrollPosition(scrollPosition.current))
			}
		}
	}, [])
	return (
		<VirtualScroller
			{...rest}
			ref={ref}
			className={classNames(className, 'CommentsList')}
			initialCustomState={initialCustomState}
			initialState={restoredState}
			onStateChange={onVirtualScrollerStateChange}
			initialScrollPosition={restoredScrollPosition}
			onScrollPositionChange={onScrollPositionChange}
			onItemInitialRender={onItemInitialRender}
			getItemId={getCommentId}
			measureItemsBatchSize={12}/>
	)
}

CommentsList = React.forwardRef(CommentsList)

CommentsList.propTypes = {
	mode: PropTypes.oneOf(['channel', 'thread']).isRequired,
	initialCustomState: PropTypes.object,
	restoredState: PropTypes.shape({
		scrollY: PropTypes.number.isRequired
	}),
	setState: PropTypes.func,
	restoredScrollPosition: PropTypes.number,
	setScrollPosition: PropTypes.func.isRequired,
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