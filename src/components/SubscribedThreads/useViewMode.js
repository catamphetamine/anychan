import { useState, useCallback, useRef, useEffect } from 'react'
import useEffectSkipMount from 'frontend-lib/hooks/useEffectSkipMount.js'

export default function useViewMode({
	hasMoreThreads,
	hasMoreAliveThreads
}) {
	const getViewMode = useCallback(() => {
		return hasMoreThreads ? (hasMoreAliveThreads ? 'alive-top' : 'alive') : 'all'
	}, [
		hasMoreThreads,
		hasMoreAliveThreads
	])

	const [viewMode, setViewMode] = useState(getViewMode())

	const showMoreLessButton = useRef()
	const showExpiredThreadsButton = useRef()

	// Reset view mode when the list of subscribed threads changes.
	useEffectSkipMount(() => {
		setViewMode(getViewMode())
	}, [getViewMode])

	// Don't manually focus the buttons because:
	//
	// * `viewMode` changes by itself when the list of subscribed threads changes.
	//
	// * Manually focusing buttons sometimes results in weird scroll behavior
	//   when it scrolls up or down in order to show the focused element on screen.
	//
	// Not re-focusing buttons manually results in focus being lost as those buttons
	// get shown or hidden, so that's not ideal in terms of "accessibility".
	//
	// useEffectSkipMount(() => {
	// 	// After a user clicks "Show expired",
	// 	// move the focus to the "Show less" button.
	// 	if (viewMode === 'all') {
	// 		if (hasMoreThreads) {
	// 			showMoreLessButton.current.focus()
	// 		}
	// 	}
	// 	// After a user clicks "Show less"
	// 	// when there're no "more" live threads
	// 	// but only "more" expired threads,
	// 	// then move the focus to the "Show expired" button.
	// 	else if (viewMode === 'alive-top') {
	// 		if (!hasMoreAliveThreads) {
	// 			showExpiredThreadsButton.current.focus()
	// 		}
	// 	}
	// }, [viewMode])

	const onShowMoreThreads = useCallback(() => {
		if (viewMode === 'alive-top') {
			if (hasMoreAliveThreads) {
				setViewMode('alive')
			} else {
				setViewMode('all')
			}
		} else {
			setViewMode('all')
		}
	}, [viewMode, hasMoreAliveThreads])

	const onShowLessThreads = useCallback(() => {
		setViewMode('alive-top')
	}, [])

	return [
		viewMode,
		onShowMoreThreads,
		onShowLessThreads,
		showMoreLessButton,
		showExpiredThreadsButton
	]
}