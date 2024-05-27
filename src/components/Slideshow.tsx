import React, { useCallback, useMemo } from 'react'
import { useDispatch } from 'react-redux'

import { useSelector, useMessages } from '@/hooks'

import Slideshow from 'social-components-react/components/Slideshow.js'
import { closeSlideshow } from '../redux/slideshow.js'

export default function Slideshow_() {
	const {
		index,
		isOpen,
		slides,
		mode,
		imageElement,
		goToSource
	} = useSelector(state => state.slideshow)

	const dispatch = useDispatch()

	const onCloseSlideshow = useCallback(() => {
		dispatch(closeSlideshow())
	}, [dispatch])

	const messages = useMessages()
	const slideshowMessages = useMemo(() => {
		return {
			...messages.slideshow,
			actions: {
				...messages.slideshow.actions,
				goToSource: messages.goToComment
			}
		}
	}, [messages])

	// <Header ref={header}/>
	// header={header.current}
	// footer={document.querySelector('.Footer .MainMenu')}

	return (
		<Slideshow
			slides={slides}
			initialSlideIndex={index}
			isOpen={isOpen}
			showControls={mode === 'flow'}
			showPagination
			imageElement={imageElement}
			goToSource={goToSource}
			onClose={onCloseSlideshow}
			messages={slideshowMessages}
			autoPlay={mode === 'flow'}
			closeOnSlideClick={mode !== 'flow'}
			overlayOpacity={mode === 'flow' ? 0.85 : 0.65}
			overlayOpacityOnFloatOpenCloseAnimation={0.1}
			animateOpenCloseOnSmallScreen={mode === 'flow' ? undefined : 'float'}
			openPictureInHoverMode
			smallScreenMaxWidth={500}
		/>
	)
}