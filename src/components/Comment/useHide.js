import { useLayoutEffect, useRef, useState, useCallback } from 'react'

import getUserData from '../../UserData.js'

import useLayoutEffectSkipMount from 'frontend-lib/hooks/useLayoutEffectSkipMount.js'

export default function useHide({
	channelId,
	threadId,
	comment,
	// getHidden: getHidden_,
	// setHidden: setHidden_,
	// state,
	// setState,
	initialHidden,
	setHidden,
	onAfterHiddenChange,
	userData = getUserData()
}) {
	// const getHidden = useCallback(() => {
	// 	return state.hidden
	// }, [
	// 	state
	// ])

	// const setHidden = useCallback((hidden) => {
	// 	setState({
	// 		...state,
	// 		hidden
	// 	})
	// }, [
	// 	state,
	// 	setState
	// ])

	// const initialHidden = getHidden_ ? getHidden_() : comment.hidden
	// const initialHidden = getHidden()

	// const [hidden_, setHiddenInternal_] = useState(initialHidden)
	const [hiddenInternal, setHiddenInternal] = useState(initialHidden)

	// const getHidden = getHidden_ || (() => hidden_)
	// const setHidden = setHidden_ || setHiddenInternal_

	const commentId = comment.id

	useLayoutEffectSkipMount(() => {
		// Update the comment's `hidden` flag.
		comment.hidden = hiddenInternal

		// Replies of this comment don't get re-generated.
		// There're two reasons for that:
		//
		// * A quote of a hidden comment no longer says: ">Hidden comment".
		// * A user could hide a given comment at any point in time
		//   while viewing a thread page, which would mean that any
		//   comment's height could change while that comment is not rendered,
		//   which would result in a warning produced by `virtual-scroller`.
		//   `onItemHeightDidChange()` function can't be used in that case
		//   because such comments wouldn't even be rendered.
		//
		//   If at some point the re-generation of replies on `parentComment`'s
		//  `.hide` flag change was to be enabled in some future,
		//   then `onItemHeightDidChange()` should still be called:
		//   even if it didn't resolve the issue in 100% cases, it would still
		//   work in some of them.
		//
		// // Re-generate the comment's replies
		// // because those could include quotes of this comment
		// // and in that case those quotes should be replaced with
		// // "Hidden comment" text.
		// comment.onContentChange({ getCommentById })

		setHidden(hiddenInternal)

		if (onAfterHiddenChange) {
			onAfterHiddenChange()
		}
	}, [hiddenInternal])

	const onHide = useCallback(() => {
		if (commentId === threadId) {
			userData.addHiddenThread(channelId, threadId)
		} else {
			userData.addHiddenComment(channelId, threadId, commentId)
		}
		setHiddenInternal(true)
	}, [
		setHiddenInternal
	])

	const onUnHide = useCallback(() => {
		if (commentId === threadId) {
			userData.removeHiddenThread(channelId, threadId)
		} else {
			userData.removeHiddenComment(channelId, threadId, commentId)
		}
		setHiddenInternal(false)
	}, [
		setHiddenInternal
	])

	return {
		hidden: hiddenInternal,
		onHide,
		onUnHide
	}
}