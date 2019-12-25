import React, { useCallback, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import VirtualScroller from 'virtual-scroller/react'
import { isInstantBackAbleNavigation, wasInstantNavigation } from 'react-pages'

function ThreadCommentsList({
	initialState,
	setState,
	scrollPosition,
	setScrollPosition,
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
	const onVirtualScrollerMount = useCallback(() => {
		if (wasInstantNavigation()) {
			window.scrollTo(0, scrollPosition)
		}
	}, [])
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
				// Using `window.pageYOffset` instead of `window.scrollY`
				// because `window.scrollY` is not supported by Internet Explorer.
				dispatch(setScrollPosition(window.pageYOffset))
			}
		}
	}, [])
	return (
		<VirtualScroller
			{...rest}
			ref={ref}
			onMount={onVirtualScrollerMount}
			initialState={wasInstantNavigation() ? initialState : undefined}
			onStateChange={onVirtualScrollerStateChange}
			onItemFirstRender={onItemFirstRender}
			measureItemsBatchSize={12}
			shouldUpdateLayoutOnWindowResize={shouldUpdateLayoutOnWindowResize}/>
	)
}

ThreadCommentsList = React.forwardRef(ThreadCommentsList)

ThreadCommentsList.propTypes = {
	initialState: PropTypes.object,
	setState: PropTypes.func,
	scrollPosition: PropTypes.number,
	setScrollPosition: PropTypes.func,
	getItem: PropTypes.func.isRequired,
	stateRef: PropTypes.object
}

export default ThreadCommentsList

function shouldUpdateLayoutOnWindowResize() {
	const slideshowElement = document.querySelector('.rrui__slideshow')
	if (slideshowElement && document.fullscreenElement &&
		slideshowElement.contains(document.fullscreenElement)) {
		return false
	}
	return true
}