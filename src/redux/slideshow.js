import { ReduxModule } from 'react-pages'

const redux = new ReduxModule('SLIDESHOW')

const SLIDESHOW_PROPERTIES = [
	'slides',
	'index',
	'imageElement',
	'goToSource'
]

const onOpenSlideshow = redux.simpleAction(
	(state, properties) => {
		const newState = {
			...state,
			isOpen: true
		}
		for (const key of Object.keys(properties)) {
			if (SLIDESHOW_PROPERTIES.includes(key)) {
				newState[key] = properties[key]
			}
		}
		return newState
	}
)

export const openSlideshow = (slides, index, options) => {
	return onOpenSlideshow({ slides, index, ...options })
}

export const closeSlideshow = redux.simpleAction(
	(state) => {
		const newState = {
			...state,
			isOpen: false
		}
		for (const key of SLIDESHOW_PROPERTIES) {
			newState[key] = undefined
		}
		return newState
	}
)

export default redux.reducer()