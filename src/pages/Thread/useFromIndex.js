import { useState, useMemo, useEffect, useCallback } from 'react'

import { replacePageUrl } from 'webapp-frontend/src/utility/history'

import getLatestReadCommentIndex from '../../utility/getLatestReadCommentIndex'
import findCommentIndexByIdOrClosestPreviousOne from '../../utility/findCommentIndexByIdOrClosestPreviousOne'

export default function useFromIndex({
	channel,
	thread,
	location,
	howManyCommentsToShowBeforeLatestReadComment,
	restoredVirtualScrollerState,
	virtualScrollerState
}) {
	// Always show some of the previous comments
	// just so that the user is a bit more confident
	// that they didn't accidentally miss any.
	const [isInitialFromIndex, setIsInitialFromIndex] = useState(true)
	// The lastest read comment index should be determined on the initial render,
	// and then it shouldn't change, so that `isPreviouslyShown()` function
	// in `src/pages/Thread/Thread.js` doesn't change on thread auto-update,
	// so that comments don't get re-rendered when it's not needed.
	const initialLatestReadCommentIndex = useMemo(() => {
		return restoredVirtualScrollerState
			? restoredVirtualScrollerState.initialLatestReadCommentIndex
			: getLatestReadCommentIndex(thread)
	}, [])
	// The requested comment index should be determined on the initial render,
	// and then it shouldn't change, so that `isPreviouslyShown()` function
	// in `src/pages/Thread/Thread.js` doesn't change on thread auto-update,
	// so that comments don't get re-rendered when it's not needed.
	const requestedCommentIndex = useMemo(() => {
		return getRequestedCommentIndex(thread, location)
	}, [])
	const initiallyShowCommentsFromTheLatestReadOne = requestedCommentIndex === undefined && initialLatestReadCommentIndex !== undefined
	const initialFromIndex = useMemo(() => {
		return getInitialFromIndex(
			channel,
			thread,
			location,
			restoredVirtualScrollerState,
			initialLatestReadCommentIndex,
			requestedCommentIndex,
			initiallyShowCommentsFromTheLatestReadOne,
			howManyCommentsToShowBeforeLatestReadComment
		)
	}, [])
	// `setFromIndex()` shouldn't be called directly.
	// Instead, it should be called via `onSetFromIndex()`.
	const [fromIndex, setFromIndex] = useState(initialFromIndex)
	const onSetFromIndex = useCallback((fromIndex) => {
		setIsInitialFromIndex(false)
		setFromIndex(fromIndex)
		if (virtualScrollerState.current) {
			virtualScrollerState.current.fromIndex = fromIndex
		}
	}, [
		setFromIndex,
		setIsInitialFromIndex,
		virtualScrollerState
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
		initialFromIndex,
		isInitialFromIndex,
		initialLatestReadCommentIndex,
		initiallyShowCommentsFromTheLatestReadOne
	]
}

/**
 * Get the index of the requested comment.
 * @param  {object} thread
 * @param  {object} location
 * @return {number} [i]
 */
function getRequestedCommentIndex(thread, location) {
	// If specific comment id is specified in URL after "#",
	// then show comments starting from that comment.
	if (location.hash) {
		const commentId = parseInt(location.hash.slice('#'.length))
		const replaceLocationHash = (newHash = '') => replacePageUrl(location.href.replace(/#.*/, newHash))
		if (isNaN(commentId)) {
			replaceLocationHash()
		} else {
			const index = findCommentIndexByIdOrClosestPreviousOne(thread, commentId)
			if (index === undefined) {
				replaceLocationHash()
			} else {
				const showFromCommentId = thread.comments[index].id
				if (showFromCommentId !== commentId) {
					replaceLocationHash(showFromCommentId === thread.id ? undefined : '#' + showFromCommentId)
				}
				return index
			}
		}
	}
}


function getInitialFromIndex(
	channel,
	thread,
	location,
	restoredVirtualScrollerState,
	initialLatestReadCommentIndex,
	requestedCommentIndex,
	initiallyShowCommentsFromTheLatestReadOne,
	howManyCommentsToShowBeforeLatestReadComment
) {
	if (restoredVirtualScrollerState) {
		return restoredVirtualScrollerState.fromIndex
	}
	if (requestedCommentIndex !== undefined) {
		return requestedCommentIndex
	}
	if (initiallyShowCommentsFromTheLatestReadOne) {
		return Math.max(0, initialLatestReadCommentIndex - howManyCommentsToShowBeforeLatestReadComment)
	}
	return 0
}