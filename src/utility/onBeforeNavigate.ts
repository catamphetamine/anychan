import type { Dispatch } from 'redux'

import { setShowSidebar } from '../redux/app.js'

export default function onBeforeNavigate({ dispatch }: { dispatch: Dispatch }) {
	// Hide sidebar pop up on navigation (only on small screens).
	dispatch(setShowSidebar(false))
}