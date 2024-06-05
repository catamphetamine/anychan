import { render } from 'react-pages/client'

import OtherPage from './pages/OtherPage/OtherPage.js'
import NoDataSourcePage from './pages/NoDataSource/NoDataSource.js'

export default async function renderNoDataSourcePage() {
	// Renders the webpage on the client side
	const { enableHotReload } = await render({
		routes: [{
			path: '/',
			Component: OtherPage,
			children: [{
				Component: NoDataSourcePage
			}, {
				path: '*',
				Component: NoDataSourcePage
			}]
		}]
	})

	// Enables hot-reload via Webpack "Hot Module Replacement".
	if (import.meta.webpackHot) {
		enableHotReload()
	}
}