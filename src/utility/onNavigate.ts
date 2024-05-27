import type { Dispatch } from 'redux'

import { closeSlideshow } from '../redux/slideshow.js'

export default function onNavigate({ dispatch }: { dispatch: Dispatch }) {
	// Close slideshow on "Back"/"Forward" navigation.
	dispatch(closeSlideshow())
}