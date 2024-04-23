import { useCallback, useRef } from 'react'
import { useDispatch } from 'react-redux'

import { subscribeToThread } from '../../redux/subscribedThreads.js'

import useUserData from '../../hooks/useUserData.js'

export default function useSubscribeToThread({
	thread
}) {
	const dispatch = useDispatch()
	const userData = useUserData()

	// `onSubscribeToThread()` function is only used when replying in a thread.
	// `onSubscribeToThread()` property doesn't change the way a comment is rendered,
	// so it should stay the same and not trigger a re-render of the comment.
	// Use a `ref` "hack" to keep its "reference" constant.
	const onSubscribeToThreadRef = useRef()

	onSubscribeToThreadRef.current = useCallback(async () => {
		await dispatch(subscribeToThread(thread, { userData }))
	}, [
		thread
	])

	const onSubscribeToThread = useCallback(() => {
		return onSubscribeToThreadRef.current()
	}, [])

	return onSubscribeToThread
}