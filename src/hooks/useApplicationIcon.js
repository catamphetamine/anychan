import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { updateApplicationIcon } from '../utility/applicationIcon.js'
import { getProvider } from '../provider.js'

export default function useApplicationIcon() {
	const autoUpdateUnreadCommentsCount = useSelector(state => state.data.autoUpdateUnreadCommentsCount)
	const autoUpdateUnreadRepliesCount = useSelector(state => state.data.autoUpdateUnreadRepliesCount)

	const [hasNewComments, setHasNewComments] = useState()
	const [hasNewReplies, setHasNewReplies] = useState()

	useEffect(() => {
		// updateApplicationIcon(getProvider().icon, {
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
			updateApplicationIcon(getProvider().icon, {
				notificationsCount: 1,
				notificationsAreImportant: hasNewReplies
			})
		} else {
			updateApplicationIcon(getProvider().icon, {
				notificationsCount: 0
			})
		}
	}, [
		hasNewComments,
		hasNewReplies
	])
}