import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { isSlideSupported } from 'webapp-frontend/src/components/Slideshow'
import { preloadPictureSlide } from 'webapp-frontend/src/components/Slideshow.Picture'
import { openSlideshow, closeSlideshow } from 'webapp-frontend/src/redux/slideshow'

export default function useSlideshow({
	thread,
	fromIndex,
	setNewFromIndex
}) {
	const dispatch = useDispatch()
	const openThreadWideSlideshow = useCallback(async () => {
		const attachments = thread.comments.reduce(
			(attachments, comment) => attachments.concat(comment.attachments || []),
			[]
		).filter(isSlideSupported)
		const firstAttachmentComment = thread.comments.slice(fromIndex).find((comment) => {
			return (comment.attachments || []).find(isSlideSupported)
		})
		let startFromIndex = 0
		if (firstAttachmentComment) {
			const firstAttachment = firstAttachmentComment.attachments.find(isSlideSupported)
			startFromIndex = attachments.indexOf(firstAttachment)
		}
		if (attachments[startFromIndex].type === 'picture') {
			try {
				await preloadPictureSlide(attachments[startFromIndex])
			} catch (error) {
				console.error(error)
			}
		}
		dispatch(openSlideshow(attachments, startFromIndex, {
			mode: 'flow',
			goToSource: (slide) => {
				const commentIndex = thread.comments.findIndex(_ => _.attachments && _.attachments.includes(slide))
				setNewFromIndex(commentIndex)
				dispatch(closeSlideshow())
			}
		}))
	}, [
		thread,
		fromIndex,
		setNewFromIndex
	])
	return [
		openThreadWideSlideshow
	]
}