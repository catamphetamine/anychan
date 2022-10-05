import { useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'

import UnreadCommentWatcher from '../../utility/comment/UnreadCommentWatcher.js'

export default function useUnreadCommentWatcher() {
	const dispatch = useDispatch()

	const unreadCommentWatcher = useMemo(() => {
		return new UnreadCommentWatcher({ dispatch })
	}, [])

	useEffect(() => {
		return () => {
			unreadCommentWatcher.stop()
		}
	}, [])

	return unreadCommentWatcher
}