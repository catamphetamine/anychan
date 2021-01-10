import { useState, useMemo, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import getRequestedCommentIndex from './getRequestedCommentIndex'

import { setFromIndex } from '../../redux/thread'

export default function useFromIndex({
	thread,
	location
}) {
	const dispatch = useDispatch()
	// Create `isInitialFromIndex` state variable.
	const isInitialFromIndex = useSelector(({ thread }) => thread.isInitialFromIndex)
	// Get `initialLatestReadCommentIndex`.
	// `initialLatestReadCommentIndex` should be determined on the initial render,
	// and then it shouldn't change, so that `isPreviouslyShown()` function
	// in `src/pages/Thread/Thread.js` doesn't change on thread auto-update,
	// so that comments don't get re-rendered when it's not needed.
	const initialLatestReadCommentIndex = useSelector(({ thread }) => thread.initialLatestReadCommentIndex)
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
	const fromIndex = useSelector(({ thread }) => thread.fromIndex)
	const onSetFromIndex = useCallback((fromIndex) => {
		dispatch(setFromIndex(fromIndex))
	}, [
		setFromIndex
	])
	// `newFromIndex` and `newFromIndexHasBeenSet` are only used
	// so that `VirtualScroller`'s `preserveScrollPositionOnPrependItems`
	// feature is briefly deactivated when the user clicks on a comment date
	// inside an "In Reply To" modal.
	const [newFromIndex, setNewFromIndex] = useState()
	const [newFromIndexHasBeenSet, setNewFromIndexHasBeenSet] = useState()
	useEffect(() => {
		if (newFromIndex !== undefined) {
			onSetFromIndex(newFromIndex)
			setNewFromIndexHasBeenSet(true)
		}
	}, [
		newFromIndex,
		onSetFromIndex,
		setNewFromIndexHasBeenSet
	])
	useEffect(() => {
		if (newFromIndexHasBeenSet) {
			setNewFromIndex(undefined)
			setNewFromIndexHasBeenSet(false)
			window.scrollTo(0, 0)
		}
	}, [
		newFromIndexHasBeenSet,
		setNewFromIndex,
		setNewFromIndexHasBeenSet
	])
	const preserveScrollPositionOnPrependItems = newFromIndex === undefined
	const setNewFromIndexPreservingScrollPosition = onSetFromIndex
	return [
		fromIndex,
		setNewFromIndex,
		setNewFromIndexPreservingScrollPosition,
		preserveScrollPositionOnPrependItems,
		isInitialFromIndex,
		initialLatestReadCommentIndex,
		initiallyShowCommentsFromTheLatestReadOne
	]
}
