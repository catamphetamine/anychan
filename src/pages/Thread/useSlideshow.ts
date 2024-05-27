import type { Thread } from '@/types'

import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { isSlideSupported } from 'social-components-react/components/Slideshow.js'
import { preloadPictureSlide } from 'social-components-react/components/Slideshow.Picture.js'
import { openSlideshow, closeSlideshow } from '../../redux/slideshow.js'

export default function useSlideshow({
	thread,
	fromIndex,
	setNewFromIndex
}: {
	thread: Thread,
	fromIndex: number,
	setNewFromIndex: (fromIndex: number) => void
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

	return {
		openSlideshow: openThreadWideSlideshow
	}
}