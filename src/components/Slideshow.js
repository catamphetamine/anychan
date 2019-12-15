import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import getMessages from '../messages'

import Slideshow from 'webapp-frontend/src/components/Slideshow'
import { closeSlideshow } from 'webapp-frontend/src/redux/slideshow'

export default function Slideshow_() {
	const locale = useSelector(({ settings }) => settings.settings.locale)
	const slideshowIndex = useSelector(({ slideshow }) => slideshow.index)
	const slideshowIsOpen = useSelector(({ slideshow }) => slideshow.isOpen)
	const slideshowSlides = useSelector(({ slideshow }) => slideshow.slides)
	const slideshowMode = useSelector(({ slideshow }) => slideshow.mode)
	const thumbnailImage = useSelector(({ slideshow }) => slideshow.thumbnailImage)
	const dispatch = useDispatch()
	const onCloseSlideshow = useCallback(() => {
		dispatch(closeSlideshow())
	}, [dispatch])
	// <Header ref={header}/>
	// header={header.current}
	// footer={document.querySelector('footer .application-menu')}
	return (
		<Slideshow
			i={slideshowIndex}
			isOpen={slideshowIsOpen}
			mode={slideshowMode}
			showControls={slideshowMode === 'flow'}
			showPagination
			thumbnailImage={thumbnailImage}
			onClose={onCloseSlideshow}
			messages={getMessages(locale).slideshow}
			closeOnSlideClick={slideshowMode !== 'flow'}
			overlayOpacity={0}
			overlayOpacityFlowMode={0.85}
			overlayOpacitySmallScreen={0.1}
			animateOpenCloseSmallScreen
			animateOpenCloseScaleSmallScreen
			animateOpenCloseOnPanOut
			smallScreenMaxWidth={500}>
			{slideshowSlides}
		</Slideshow>
	)
}