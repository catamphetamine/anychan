import Application from './pages/Application'
import Home from './pages/Home'
import Board from './pages/Board'
import Thread from './pages/Thread'
import Settings from './pages/Settings'

import { ERROR_PAGES, NOT_FOUND } from 'webapp-frontend/src/routes.common'

export default [{
	path: '/',
	Component: Application,
	children: [
		{ Component: Home },
		{ path: 'settings', Component: Settings },
		...ERROR_PAGES,
		{ path: ':board', Component: Board },
		{ path: ':board/:thread', Component: Thread },
		NOT_FOUND
	]
}]