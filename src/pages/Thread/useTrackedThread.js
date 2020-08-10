import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import hasAttachmentPicture from 'social-components/commonjs/utility/attachment/hasPicture'
import getThumbnailSize from 'social-components/commonjs/utility/attachment/getThumbnailSize'

import { trackThread, untrackThread } from '../../redux/threadTracker'

export default function useTrackedThread({
	board,
	thread
}) {
	const dispatch = useDispatch()
	const isThreadTracked = useSelector(({ threadTracker }) => threadTracker.trackedThreadsIndex[board.id] && threadTracker.trackedThreadsIndex[board.id].includes(thread.id))
	const onSetThreadTracked = useCallback((shouldTrackThread) => {
		if (shouldTrackThread) {
			const latestComment = thread.comments[thread.comments.length - 1]
			const trackedThread = {
				id: thread.id,
				title: thread.title,
				board: {
					id: board.id,
					title: board.title
				},
				latestComment: {
					id: latestComment.id,
					createdAt: latestComment.createdAt.getTime(),
				}
			}
			const thumbnailAttachment = thread.comments[0].attachments && thread.comments[0].attachments.filter(hasAttachmentPicture)[0]
			if (thumbnailAttachment) {
				const thumbnail = getThumbnailSize(thumbnailAttachment)
				trackedThread.thumbnail = {
					type: thumbnail.type,
					url: thumbnail.url,
					width: thumbnail.width,
					height: thumbnail.height
				}
				if (thumbnailAttachment.spoiler) {
					trackedThread.thumbnail.spoiler = true
				}
			}
			dispatch(trackThread(trackedThread))
		} else {
			dispatch(untrackThread({
				id: thread.id,
				board: {
					id: board.id
				}
			}))
		}
	}, [
		board,
		thread
	])
	return [
		isThreadTracked,
		onSetThreadTracked
	]
}