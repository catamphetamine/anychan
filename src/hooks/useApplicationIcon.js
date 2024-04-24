import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { updateApplicationIcon } from '../utility/applicationIcon.js'

import useDataSource from '../hooks/useDataSource.js'

// Sets up a listener that changes the application icon based on the application status:
// * Unread comments
// * Unread replies
export default function useApplicationIcon() {
	const dataSource = useDataSource()

	const autoUpdateUnreadCommentsCount = useSelector(state => state.data.autoUpdateUnreadCommentsCount)
	const autoUpdateUnreadRepliesCount = useSelector(state => state.data.autoUpdateUnreadRepliesCount)

	const [hasNewComments, setHasNewComments] = useState()
	const [hasNewReplies, setHasNewReplies] = useState()

	useEffect(() => {
		// updateApplicationIcon(dataSource.icon, {
		// 	notificationsCount: autoUpdateUnreadCommentsCount
		// 	notificationsAreImportant: ...
		// })
		setHasNewComments(autoUpdateUnreadCommentsCount > 0)
		setHasNewReplies(autoUpdateUnreadRepliesCount > 0)
	}, [
		autoUpdateUnreadCommentsCount,
		autoUpdateUnreadRepliesCount
	])

	useEffect(() => {
		if (hasNewComments || hasNewReplies) {
			updateApplicationIcon(dataSource.icon, {
				notificationsCount: 1,
				notificationsAreImportant: hasNewReplies
			})
		} else {
			updateApplicationIcon(dataSource.icon, {
				notificationsCount: 0
			})
		}
	}, [
		hasNewComments,
		hasNewReplies,
		dataSource
	])
}