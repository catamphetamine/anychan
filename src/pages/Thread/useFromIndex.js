import { useState, useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import useEffectSkipMount from 'frontend-lib/hooks/useEffectSkipMount.js'

import getRequestedCommentIndex from './getRequestedCommentIndex.js'

import { setFromIndex } from '../../redux/thread.js'

export default function useFromIndex({
	thread,
	location
}) {
	const dispatch = useDispatch()

	// Create `isInitialFromIndex` state variable.
	const isInitialFromIndex = useSelector(state => state.thread.isInitialFromIndex)

	// Get `initialLatestReadCommentIndex`.
	// `initialLatestReadCommentIndex` should be determined on the initial render,
	// and then it shouldn't change, so that `isPreviouslyShown()` function
	// in `src/pages/Thread/Thread.js` doesn't change on thread auto-update,
	// so that comments don't get re-rendered when it's not needed.
	const { initialLatestReadCommentIndex } = useSelector(state => state.thread)

	// The requested comment index should be determined on the initial render,
	// and then it shouldn't change, so that `isPreviouslyShown()` function
	// in `src/pages/Thread/Thread.js` doesn't change on thread auto-update,
	// so that comments don't get re-rendered when it's not needed.
	const requestedCommentIndex = useMemo(() => {
		return getRequestedCommentIndex(thread, location)
	}, [])

	// This variable is also copy-pasted in `getInitialFromIndex.js`.
	const initiallyShowCommentsFromTheLatestReadOne = requestedCommentIndex === undefined && initialLatestReadCommentIndex !== undefined

	// Create `fromIndex` state variable.
	const fromIndex = useSelector(state => state.thread.fromIndex)

	const onSetFromIndex = useCallback((fromIndex) => {
		dispatch(setFromIndex(fromIndex))
	}, [])

	// `newFromIndex` and `newFromIndexHasBeenSet` are only used
	// so that `VirtualScroller`'s `preserveScrollPositionOnPrependItems`
	// feature is briefly deactivated when the user clicks on a comment date
	// inside an "In Reply To" modal.
	const [newFromIndex, setNewFromIndex] = useState()
	const [newFromIndexHasBeenSet, setNewFromIndexHasBeenSet] = useState()

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
		initiallyShowCommentsFromTheLatestReadOne
	}
}
