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