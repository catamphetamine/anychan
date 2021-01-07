import Application from './pages/Application'
import Home from './pages/Home'
import Channels from './pages/Channels'
import Channel from './pages/Channel/Channel'
import Thread from './pages/Thread/Thread'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'
import Offline from './pages/Offline'
import GenericError from './pages/Error'

import { ERROR_PAGES } from 'webapp-frontend/src/routes.common'

const DEFAULT_ERROR_PAGES = ERROR_PAGES.filter(_ => _.status !== 500 && _.status !== 404)

export default [{
	path: '/',
	Component: Application,
	children: [
		{ Component: Home },
		{ path: 'channels', Component: Channels },
		{ path: 'settings', Component: Settings },
		...DEFAULT_ERROR_PAGES,
		{ path: 'error', status: 500, Component: GenericError },
		{ path: 'offline', status: 503, Component: Offline },
		{ path: 'not-found', status: 404, Component: NotFound },
		{ path: ':channelId', Component: Channel },
		{ path: ':channelId/:threadId', Component: Thread },
		{ path: '*', status: 404, Component: NotFound }
	]
}]