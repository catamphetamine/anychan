import { useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'

import UnreadCommentWatcher from '../../utility/UnreadCommentWatcher'
import { resetNewAutoUpdateCommentIndexes } from '../../redux/data'

export default function useUnreadCommentWatcher() {
	const dispatch = useDispatch()
	const unreadCommentWatcher = useMemo(() => {
		return new UnreadCommentWatcher({ dispatch })
	}, [])
	useEffect(() => {
		return () => {
			unreadCommentWatcher.stop()
			dispatch(resetNewAutoUpdateCommentIndexes())
		}
	}, [])
	return unreadCommentWatcher
}