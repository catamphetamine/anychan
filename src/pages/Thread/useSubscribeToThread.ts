import type { Thread } from '@/types'

import { useCallback, useRef } from 'react'
import { useDispatch } from 'react-redux'

import useUserData from '../../hooks/useUserData.js'

import addSubscribedThread from '@/utility/subscribedThread/addSubscribedThread.js'

export default function useSubscribeToThread({ thread }: { thread: Thread }) {
	const dispatch = useDispatch()
	const userData = useUserData()

	// `onSubscribeToThread()` function is only used when replying in a thread.
	// `onSubscribeToThread()` property doesn't change the way a comment is rendered,
	// so it should stay the same and not trigger a re-render of the comment.
	// Use a `ref` "hack" to keep its "reference" constant.
	const onSubscribeToThreadRef = useRef<() => void>()

	onSubscribeToThreadRef.current = useCallback(() => {
		addSubscribedThread({ thread, dispatch, userData })
	}, [
		thread,
		userData
	])

	const onSubscribeToThread = useCallback(() => {
		onSubscribeToThreadRef.current()
	}, [])

	return onSubscribeToThread
}