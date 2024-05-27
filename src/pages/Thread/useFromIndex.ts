import type { Thread } from '@/types'
import type { Location } from 'react-pages'

import { useState, useMemo, useCallback } from 'react'
import { useDispatch } from 'react-redux'

import useEffectSkipMount from 'frontend-lib/hooks/useEffectSkipMount.js'

import getRequestedCommentIndex from './getRequestedCommentIndex.js'
import getShouldInitiallyShowCommentsStartingFromTheLatestReadOne from './getShouldInitiallyShowCommentsStartingFromTheLatestReadOne.js'

import { setFromIndex } from '../../redux/threadPage.js'

import { usePageStateSelector } from '@/hooks'

export default function useFromIndex({
	thread,
	location
}: {
	thread: Thread,
	location: Location
}) {
	const dispatch = useDispatch()

	// Create `isInitialFromIndex` state variable.
	const isInitialFromIndex = usePageStateSelector('threadPage', state => state.threadPage.isInitialFromIndex)

	// Get `initialLatestReadCommentIndex`.
	// `initialLatestReadCommentIndex` should be determined on the initial render,
	// and then it shouldn't change, so that `isPreviouslyShown()` function
	// in `src/pages/Thread/Thread.js` doesn't change on thread auto-update,
	// so that comments don't get re-rendered when it's not needed.
	const initialLatestReadCommentIndex = usePageStateSelector('threadPage', state => state.threadPage.initialLatestReadCommentIndex)

	// The requested comment index should be determined on the initial render,
	// and then it shouldn't change, so that `isPreviouslyShown()` function
	// in `src/pages/Thread/Thread.js` doesn't change on thread auto-update,
	// so that comments don't get re-rendered when it's not needed.
	const requestedCommentIndex = useMemo(() => {
		return getRequestedCommentIndex(thread, location)
	}, [])

	// Whether it should show comments starting from the latest read one.
	const shouldInitiallyShowCommentsStartingFromTheLatestReadOne = getShouldInitiallyShowCommentsStartingFromTheLatestReadOne({
		requestedCommentIndex,
		initialLatestReadCommentIndex
	})

	// Create `fromIndex` state variable.
	const fromIndex = usePageStateSelector('threadPage', state => state.threadPage.fromIndex)

	const onSetFromIndex = useCallback((fromIndex: number) => {
		dispatch(setFromIndex(fromIndex))
	}, [])

	// `newFromIndex` and `newFromIndexHasBeenSet` are only used
	// so that `VirtualScroller`'s `preserveScrollPositionOnPrependItems`
	// feature is briefly deactivated when the user clicks on a comment date
	// inside an "In Reply To" modal.
	const [newFromIndex, setNewFromIndex] = useState<number>()
	const [newFromIndexHasBeenSet, setNewFromIndexHasBeenSet] = useState<boolean>()

	useEffectSkipMount(() => {
		if (newFromIndex !== undefined) {
			onSetFromIndex(newFromIndex)
			setNewFromIndexHasBeenSet(true)
		}
	}, [
		newFromIndex
	])

	useEffectSkipMount(() => {
		if (newFromIndexHasBeenSet) {
			setNewFromIndex(undefined)
			setNewFromIndexHasBeenSet(false)
			window.scrollTo(0, 0)
		}
	}, [
		newFromIndexHasBeenSet
	])

	const preserveScrollPositionOnPrependItems = newFromIndex === undefined
	const setNewFromIndexPreservingScrollPosition = onSetFromIndex

	return {
		fromIndex,
		setNewFromIndex,
		setNewFromIndexPreservingScrollPosition,
		preserveScrollPositionOnPrependItems,
		isInitialFromIndex,
		initialLatestReadCommentIndex,
		shouldInitiallyShowCommentsStartingFromTheLatestReadOne
	}
}
