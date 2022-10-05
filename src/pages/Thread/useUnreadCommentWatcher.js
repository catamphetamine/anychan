import { useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'

import { resetAutoUpdateNewCommentsIndication } from '../../redux/data.js'

import UnreadCommentWatcher from '../../utility/comment/UnreadCommentWatcher.js'

export default function useUnreadCommentWatcher() {
	const dispatch = useDispatch()

	const unreadCommentWatcher = useMemo(() => {
		return new UnreadCommentWatcher({ dispatch })
	}, [])

	useEffect(() => {
		return () => {
			unreadCommentWatcher.stop()
			dispatch(resetAutoUpdateNewCommentsIndication())
		}
	}, [])

	return unreadCommentWatcher
}