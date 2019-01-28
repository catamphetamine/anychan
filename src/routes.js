import Application from './pages/Application'
import Home from './pages/Home'
import Board from './pages/Board'
import Thread from './pages/Thread'
import Settings from './pages/Settings'

import { ERROR_PAGES_ROUTES } from 'webapp-frontend/src/routes.common'

export default [{
	path: '/',
	Component: Application,
	children: [
		{ Component: Home },
		{ path: 'profile', Component: Settings },
		...ERROR_PAGES_ROUTES,
		{ path: ':board', Component: Board },
		{ path: ':board/:thread', Component: Thread }
	]
}]