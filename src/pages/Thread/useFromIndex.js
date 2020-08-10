import { useState, useMemo, useEffect, useCallback, useRef } from 'react'

import { replacePageUrl } from 'webapp-frontend/src/utility/history'

import UserData from '../../UserData/UserData'

export default function useFromIndex({
	board,
	thread,
	location,
	commentsShownBeforeLatestReadCount,
	restoredVirtualScrollerState,
	virtualScrollerState
}) {
	// Using `useMemo()` here to avoid reading from `localStorage` on each render.
	// Maybe it's not required, but just in case.
	const requestedCommentIndex = useMemo(() => {
		return getRequestedCommentIndex(thread, location)
	}, [
		thread,
		location
	])
	const latestReadCommentIndex = useMemo(() => {
		if (restoredVirtualScrollerState) {
			return restoredVirtualScrollerState.latestReadCommentIndex
		}
		return getLatestReadCommentIndex(thread, board)
	}, [
		thread,
		board
	])
	const showFromRequestedComment = requestedCommentIndex !== undefined
	const showFromLatestReadComment = !showFromRequestedComment && latestReadCommentIndex !== undefined
	// Always show some of the previous comments
	// just so that the user is a bit more confident
	// that they didn't accidentally miss any.
	const [isInitialFromIndex, setIsInitialFromIndex] = useState(true)
	const noNewComments = showFromLatestReadComment && latestReadCommentIndex === thread.comments.length - 1 && isInitialFromIndex
	const _initialFromIndex = useMemo(() => {
		if (showFromRequestedComment) {
			return requestedCommentIndex
		}
		if (showFromLatestReadComment) {
			return Math.max(0, latestReadCommentIndex - commentsShownBeforeLatestReadCount)
		}
		return 0
	}, [
		showFromRequestedComment,
		showFromLatestReadComment,
		requestedCommentIndex,
		latestReadCommentIndex,
		commentsShownBeforeLatestReadCount
	])
	const initialFromIndex = restoredVirtualScrollerState ? restoredVirtualScrollerState.fromIndex : _initialFromIndex
	// `setFromIndex()` shouldn't be called directly.
	// Instead, it should be called via `onSetFromIndex()`.
	const [fromIndex, setFromIndex] = useState(initialFromIndex)
	// `fromIndexRef` is only used in `onShowComment()`
	// to prevent changing `itemComponentProps` when `fromIndex` changes
	// which would happen if `onShowComment()` used `fromIndex` directly.
	// This results in not re-rendering the whole comments list
	// when clicking "Show previous" button.
	const fromIndexRef = useRef(fromIndex)
	const onSetFromIndex = useCallback((fromIndex) => {
		setIsInitialFromIndex(false)
		setFromIndex(fromIndex)
		fromIndexRef.current = fromIndex
		if (virtualScrollerState.current) {
			virtualScrollerState.current.fromIndex = fromIndex
		}
	}, [
		setFromIndex,
		setIsInitialFromIndex,
		fromIndexRef,
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
		latestReadCommentIndex,
		showFromLatestReadComment
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
			const index = getCommentIndexByIdOrClosest(commentId, thread)
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

/**
 * Get the index of the requested comment.
 * @param  {object} thread
 * @param  {object} board
 * @return {number} [i]
 */
function getLatestReadCommentIndex(thread, board) {
	// Show comments starting from the comment,
	// that's immediately after the latest read one.
	const latestReadCommentInfo = UserData.getLatestReadComments(board.id, thread.id)
	if (latestReadCommentInfo) {
		return getCommentIndexByIdOrClosest(latestReadCommentInfo.id, thread)
	}
}

/**
 * Finds comment's index (or, if the comment has been deleted, return the index of the closest one).
 * @param  {number} id
 * @param  {object} thread
 * @return {number} [i] Returns `undefined` if no appropriate match found.
 */
function getCommentIndexByIdOrClosest(id, thread) {
	// Find latest read comment index.
	let i = thread.comments.length - 1
	while (i >= 0) {
		// A comment might have been deleted,
		// in which case find the closest previous one.
		if (thread.comments[i].id <= id) {
			return i
		}
		i--
	}
}
