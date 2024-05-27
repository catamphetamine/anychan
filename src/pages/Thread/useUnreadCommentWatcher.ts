import type { Channel, Thread } from '@/types'

import { useEffect, useCallback, useMemo, useRef } from 'react'
import { useDispatch } from 'react-redux'

import useUserData from '../../hooks/useUserData.js'

import UnreadCommentWatcher from '../../utility/comment/UnreadCommentWatcher.js'

export default function useUnreadCommentWatcher({
	channel,
	thread
}: {
	channel?: Channel,
	thread?: Thread
} = {}) {
	const dispatch = useDispatch()
	const userData = useUserData()

	const currentThread = useRef<Thread>()

	// `thread` object reference will be updated during "auto-refresh".
	currentThread.current = thread

	const getThread = useCallback(() => {
		return currentThread.current
	}, [])

	const unreadCommentWatcher = useMemo(() => {
		return new UnreadCommentWatcher({
			dispatch,
			userData,
			channel,
			getThread
		})
	}, [])

	useEffect(() => {
		unreadCommentWatcher.start()
		return () => {
			unreadCommentWatcher.stop()
		}
	}, [])

	return unreadCommentWatcher
}