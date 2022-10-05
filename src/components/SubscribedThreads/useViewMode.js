import { useState, useCallback, useRef, useEffect } from 'react'
import useEffectSkipMount from 'frontend-lib/hooks/useEffectSkipMount.js'

export default function useViewMode({
	hasMoreThreads,
	hasMoreLiveThreads
}) {
	const getViewMode = useCallback(() => {
		return hasMoreThreads ? (hasMoreLiveThreads ? 'top' : 'live') : 'all'
	}, [
		hasMoreThreads,
		hasMoreLiveThreads
	])
	const [viewMode, setViewMode] = useState(getViewMode())
	const showMoreLessButton = useRef()
	const showExpiredThreadsButton = useRef()
	useEffectSkipMount(() => {
		setViewMode(getViewMode())
	}, [getViewMode])
	useEffectSkipMount(() => {
		// After a user clicks "Show expired",
		// move the focus to the "Show less" button.
		if (viewMode === 'all') {
			if (hasMoreThreads) {
				showMoreLessButton.current.focus()
			}
		}
		// After a user clicks "Show less"
		// when there're no "more" live threads
		// but only "more" expired threads,
		// then move the focus to the "Show expired" button.
		else if (viewMode === 'top') {
			if (!hasMoreLiveThreads) {
				showExpiredThreadsButton.current.focus()
			}
		}
	}, [viewMode])
	const onShowMoreThreads = useCallback(() => {
		if (viewMode === 'top') {
			if (hasMoreLiveThreads) {
				setViewMode('live')
			} else {
				setViewMode('all')
			}
		} else {
			setViewMode('all')
		}
	}, [viewMode, hasMoreLiveThreads])
	const onShowLessThreads = useCallback(() => {
		setViewMode('top')
	}, [])
	return [
		viewMode,
		onShowMoreThreads,
		onShowLessThreads,
		showMoreLessButton,
		showExpiredThreadsButton
	]
}