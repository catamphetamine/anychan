import type { CommentId, Comment, GetCommentById, ThreadNavigationHistory } from '@/types'

import { useState, useCallback, useRef } from 'react'
import { useDispatch } from 'react-redux'

import useMessages from '../../hooks/useMessages.js'

import { InReplyToModalCloseTimeout, InReplyToModalScrollToTopAndFocus } from '../../components/InReplyToModal.js'

import { notify } from '../../redux/notifications.js'
// import { getViewportHeight } from 'web-browser-window'

export default function useThreadNavigation({ getCommentById }: { getCommentById:  GetCommentById }) {
	const messages = useMessages()
	const dispatch = useDispatch()

	const [threadNavigationHistory, setThreadNavigationHistory] = useState([])

	// `threadNavigationHistoryRef` is only used in `onNavigateToComment()`
	// to prevent changing `itemComponentProps` when `threadNavigationHistory` changes
	// which would happen if `onNavigateToComment()` used `threadNavigationHistory` directly.
	// This results in not re-rendering the whole comments list
	// when clicking "Show previous" button.
	const threadNavigationHistoryRef = useRef<ThreadNavigationHistory>(threadNavigationHistory)

	const onSetThreadNavigationHistory = useCallback((history: ThreadNavigationHistory) => {
		setThreadNavigationHistory(history)
		threadNavigationHistoryRef.current = history
	}, [
		setThreadNavigationHistory,
		threadNavigationHistoryRef
	])

	const resetThreadNavigationHistoryTimeout = useRef<number>()

	const [isThreadHistoryModalShown, setThreadHistoryModalShown] = useState<boolean>()

	const onShowThreadHistoryModal = useCallback(() => {
		clearTimeout(resetThreadNavigationHistoryTimeout.current)
		setThreadHistoryModalShown(true)
	}, [
		setThreadHistoryModalShown,
		resetThreadNavigationHistoryTimeout
	])

	const hideThreadHistoryModal = useCallback(() => {
		clearTimeout(resetThreadNavigationHistoryTimeout.current)
		resetThreadNavigationHistoryTimeout.current = setTimeout(() => {
			onSetThreadNavigationHistory([])
		}, InReplyToModalCloseTimeout)
		setThreadHistoryModalShown(false)
	}, [
		setThreadHistoryModalShown,
		onSetThreadNavigationHistory,
		resetThreadNavigationHistoryTimeout
	])

	// // `thread` object reference changes on every auto-update.
	// // A `ref` is used instead of a dependency on `thread` itself
	// // so that `onNavigateToComment()` itself doesn't change on
	// // thread auto-update. Otherwise, `itemComponentProps` would change,
	// // and then `<VirtualScroller/>` would re-render all comments on
	// // thread auto-update (instead of updating just the comments that changed).
	// const threadRef = useRef()
	// threadRef.current = thread
	// This function is called when a user is veiwing comment with ID
	// `fromCommentId` and clicks a link to comment with ID `commentId`.
	const onNavigateToComment = useCallback((commentId: CommentId, fromCommentId: CommentId) => {
		const comment = getCommentById(commentId)
		if (!comment) {
			dispatch(notify(messages.noSearchResults))
			console.error(`Comment #${commentId} not found`)
			return
		}

		// Displaying a modal with comment content is used
		// instead of scrolling to the comment.
		// // `fromIndexRef` is used instead of `fromIndex`
		// // to avoid having `fromIndex` in the list of dependencies
		// // which would result in re-rendering all comments
		// // when a user clicks "Show previous" button.
		// const fromIndex = fromIndexRef.current
		// if (index < fromIndex) {
		// 	dispatch(notify('Comment not rendered'))
		// 	return
		// }
		// const { top } = virtualScroller.current.getItemCoordinates(index - fromIndex)
		// const headerHeight = document.querySelector('.Header').offsetHeight
		// window.scrollTo(0, top - headerHeight)

		onShowThreadHistoryModal()

		let history = threadNavigationHistoryRef.current

		// Don't do anything if already viewing the requested comment.
		// For example, when the user clicks on a quote in a post,
		// `InReplyToModal` is opened with the quoted comment.
		// Then, the user expands the list of replies to that comment
		// in that modal, finds that same reply and clicks on the quote once again.
		// In those cases, it shouldn't do anything because the user is already viewing
		// the quoted comment in the modal.
		if (history.length > 0) {
			const { comment } = history[history.length - 1]
			if (comment.id === commentId) {
				return
			}
		}

		// This turned out to feel inconsistent, so this feature was disabled.
		// // Don't add an entry to the history if the comment with the
		// // `post-link` being clicked is still visible after scrolling
		// // to the quoted comment (with some bottom margin).
		// const fromCommentIndex = thread.comments.findIndex(_ => _.id === fromCommentId);
		// const { top: fromCommentTop } = virtualScroller.current.getItemCoordinates(fromCommentIndex - fromIndex)
		// if (fromCommentTop > top - headerHeight + getViewportHeight() * 0.9) {
			// onSetThreadNavigationHistory(history.concat({ commentId: fromCommentId }))
			// Add the initial "from" history entry.
			if (history.length === 0) {
				history = history.concat(createHistoryEntryForComment(getCommentById(fromCommentId)))
			}
			// `.hasContentBeenParsed` flag is set by the `parseContent()`
			// function that the `imageboard` library has created.
			// Don't set this flag manually. Only read it.
			if (!comment.hasContentBeenParsed) {
				comment.parseContent({ getCommentById })
			}
			onSetThreadNavigationHistory(history.concat(createHistoryEntryForComment(comment)))
			// Scroll comment history modal to top.
			InReplyToModalScrollToTopAndFocus()
		// }
	},
	// This dependencies list should be such that
	// comments aren't re-rendered when they don't need to.
	// (`itemComponentProps` depends on `onNavigateToComment`)
	[
		getCommentById,
		dispatch,
		messages,
		onShowThreadHistoryModal,
		threadNavigationHistoryRef,
		onSetThreadNavigationHistory
	])

	const onGoBackInThreadNavigationHistory = useCallback(() => {
		const newThreadNavigationHistory = threadNavigationHistory.slice()
		newThreadNavigationHistory.pop()
		onSetThreadNavigationHistory(newThreadNavigationHistory)
		// Scroll comment history modal to top.
		InReplyToModalScrollToTopAndFocus()
	}, [
		onSetThreadNavigationHistory,
		threadNavigationHistory
	])

	return {
		threadNavigationHistory,
		onNavigateToComment,
		onGoBackInThreadNavigationHistory,
		isThreadHistoryModalShown,
		hideThreadHistoryModal
	}
}

function createHistoryEntryForComment(comment: Comment) {
	return { comment }
}