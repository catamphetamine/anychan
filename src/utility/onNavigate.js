import { closeSlideshow } from '../redux/slideshow.js'

export default function onNavigate({ dispatch }) {
	// Close slideshow on "Back"/"Forward" navigation.
	dispatch(closeSlideshow())
}