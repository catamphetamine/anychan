import type { SlideshowSlide, State } from '@/types'

import { ReduxModule } from 'react-pages'

const redux = new ReduxModule<State['slideshow']>()

const SLIDESHOW_PROPERTIES = [
	'slides',
	'index',
	'mode',
	'imageElement',
	'goToSource'
] as const

const onOpenSlideshow = redux.simpleAction(
	(state, properties: Partial<Record<typeof SLIDESHOW_PROPERTIES[number], any>>) => {
		const newState = {
			...state,
			isOpen: true
		}
		for (const key of Object.keys(properties) as Array<keyof typeof properties>) {
			if (SLIDESHOW_PROPERTIES.includes(key)) {
				// @ts-expect-error
				newState[key] = properties[key]
			}
		}
		return newState
	}
)

export const openSlideshow = (slides: SlideshowSlide[], index: number, options?: {
	imageElement?: Element,
	mode?: 'flow',
	goToSource?: (slide: SlideshowSlide) => void
}) => {
	return onOpenSlideshow({ slides, index, ...options })
}

export const closeSlideshow = redux.simpleAction(
	(state) => {
		const newState = {
			...state,
			isOpen: false
		}
		for (const key of SLIDESHOW_PROPERTIES) {
			// @ts-expect-error
			newState[key] = undefined
		}
		return newState
	}
)

export default redux.reducer()