import { render } from 'react-pages/client'

import OtherPage from './pages/OtherPage/OtherPage'
import NoDataSourcePage from './pages/NoDataSource/NoDataSource'

export default async function renderNoDataSourcePage() {
	// Renders the webpage on the client side
	const { enableHotReload } = await render({
		routes: [{
			path: '/',
			Component: OtherPage,
			children: [{
				path: '*',
				Component: NoDataSourcePage
			}]
		}]
	})

	// Enables hot-reload via Webpack "Hot Module Replacement".
	// @ts-expect-error
	if (import.meta.webpackHot) {
		enableHotReload()
	}
}