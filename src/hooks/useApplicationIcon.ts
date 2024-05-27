import { useEffect, useState } from 'react'

import { updateApplicationIcon } from '../utility/applicationIcon.js'

import useDataSource from '../hooks/useDataSource.js'
import { usePageStateSelectorOutsideOfPage } from '@/hooks'

// Sets up a listener that changes the application icon based on the application status:
// * Unread comments
// * Unread replies
export default function useApplicationIcon() {
	const dataSource = useDataSource()

	const autoUpdateUnreadCommentsCount = usePageStateSelectorOutsideOfPage('thread', state => state.thread.autoUpdateUnreadCommentsCount)
	const autoUpdateUnreadRepliesCount = usePageStateSelectorOutsideOfPage('thread', state => state.thread.autoUpdateUnreadRepliesCount)

	const [hasNewComments, setHasNewComments] = useState<boolean>(false)
	const [hasNewReplies, setHasNewReplies] = useState<boolean>(false)

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
				notificationsCount: 0,
				notificationsAreImportant: false
			})
		}
	}, [
		hasNewComments,
		hasNewReplies,
		dataSource
	])
}