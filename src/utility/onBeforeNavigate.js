import { hideSidebar } from '../redux/app.js'

export default function onBeforeNavigate({ dispatch }) {
	// Hide sidebar pop up on navigation (only on small screens).
	dispatch(hideSidebar())
}