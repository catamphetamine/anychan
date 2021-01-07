import { useState, useCallback, useRef, useEffect } from 'react'

export default function useViewMode({
	isMounted,
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
	useEffect(() => {
		if (isMounted()) {
			setViewMode(getViewMode())
		}
	}, [getViewMode])
	useEffect(() => {
		if (isMounted()) {
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
	]
}