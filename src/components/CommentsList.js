import React, { useCallback, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import VirtualScroller from 'virtual-scroller/react'
import { isInstantBackAbleNavigation } from 'react-pages'

function CommentsList({
	mode,
	initialCustomState,
	restoredState,
	setState,
	getItem,
	stateRef,
	...rest
}, ref) {
	const _stateRef = useRef()
	const virtualScrollerState = stateRef || _stateRef
	const onVirtualScrollerStateChange = useCallback(
		state => virtualScrollerState.current = state,
		[]
	)
	const onItemFirstRender = useCallback(
		(i) => getItem(i).parseContent(),
		[getItem]
	)
	const dispatch = useDispatch()
	useEffect(() => {
		return () => {
			if (isInstantBackAbleNavigation()) {
				// Save `virtual-scroller` state in Redux state.
				dispatch(setState(virtualScrollerState.current))
			}
		}
	}, [])
	return (
		<VirtualScroller
			{...rest}
			ref={ref}
			initialCustomState={initialCustomState}
			initialState={restoredState}
			onStateChange={onVirtualScrollerStateChange}
			onItemFirstRender={onItemFirstRender}
			measureItemsBatchSize={12}
			shouldUpdateLayoutOnWindowResize={shouldUpdateLayoutOnWindowResize}/>
	)
}

CommentsList = React.forwardRef(CommentsList)

CommentsList.propTypes = {
	mode: PropTypes.oneOf(['board', 'thread']).isRequired,
	initialCustomState: PropTypes.object,
	restoredState: PropTypes.shape({
		scrollY: PropTypes.number.isRequired
	}),
	setState: PropTypes.func,
	getItem: PropTypes.func.isRequired,
	stateRef: PropTypes.object
}

export default CommentsList

function shouldUpdateLayoutOnWindowResize() {
	const slideshowElement = document.querySelector('.rrui__slideshow')
	if (slideshowElement && document.fullscreenElement &&
		slideshowElement.contains(document.fullscreenElement)) {
		return false
	}
	return true
}