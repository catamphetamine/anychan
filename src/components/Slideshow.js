import React, { useCallback, useMemo } from 'react'
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
	const slideshowImageElement = useSelector(({ slideshow }) => slideshow.imageElement)
	const goToSource = useSelector(({ slideshow }) => slideshow.goToSource)
	const dispatch = useDispatch()
	const onCloseSlideshow = useCallback(() => {
		dispatch(closeSlideshow())
	}, [dispatch])
	const messages = useMemo(() => {
		const messages = getMessages(locale)
		return {
			...messages.slideshow,
			actions: {
				...messages.slideshow.actions,
				goToSource: messages.goToComment
			}
		}
	}, [locale])
	// <Header ref={header}/>
	// header={header.current}
	// footer={document.querySelector('.Footer .MainMenu')}
	return (
		<Slideshow
			i={slideshowIndex}
			isOpen={slideshowIsOpen}
			mode={slideshowMode}
			showControls={slideshowMode === 'flow'}
			showPagination
			imageElement={slideshowImageElement}
			goToSource={goToSource}
			onClose={onCloseSlideshow}
			messages={messages}
			closeOnSlideClick={slideshowMode !== 'flow'}
			overlayOpacity={0}
			overlayOpacityFlowMode={0.85}
			overlayOpacityWhenPagingThrough={0.65}
			overlayOpacitySmallScreen={0.1}
			animateOpenCloseSmallScreen
			animateOpenCloseScaleSmallScreen
			animateOpenCloseOnPanOut
			smallScreenMaxWidth={500}>
			{slideshowSlides}
		</Slideshow>
	)
}