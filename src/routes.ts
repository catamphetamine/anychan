import Application from './pages/Application.js'
import Home from './pages/Home.js'
import Channel from './pages/Channel/Channel.js'
import Thread from './pages/Thread/Thread.js'
import Settings from './pages/Settings.js'
import UserAccount from './pages/UserAccount.js'
import NotFound from './pages/NotFound.js'
import Offline from './pages/Offline.js'
import GenericError from './pages/Error.js'

export default [{
	path: '/',
	Component: Application,
	children: [
		{ Component: Home },
		{ path: 'settings', Component: Settings },
		{ path: 'user', Component: UserAccount },
		{ path: 'error', status: 500, default: true, Component: GenericError },
		{ path: 'offline', status: 503, Component: Offline },
		{ path: 'not-found', status: 404, default: true, Component: NotFound },
		{ path: ':channelId', Component: Channel },
		{ path: ':channelId/:threadId', Component: Thread },
		{ path: '*', status: 404, Component: NotFound }
	]
}]