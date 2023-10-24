import routes  from './routes.js'
import * as reducers from './redux/reducers.with-hot-reload.js'

import getBasePath from './utility/getBasePath.js'
import getReactPagesConfig_ from 'frontend-lib/utility/react-pages.js'

import ApplicationWrapper from './components/ApplicationWrapper.js'
import PageLoading from './components/PageLoading.js'

import getApplicationMeta from './pages/Application.meta.js'

export default function getReactPagesConfig() {
	return getReactPagesConfig_({
		rootComponent: ApplicationWrapper,
		routes,
		reducers,

		basename: getBasePath(),

		// This parameter will be transformed into an `onError()` function of `react-pages`.
		errorPages: {
			'404': '/not-found',
			'500': '/error'
		},

		// When the website is open in a web browser,
		// hide website content under a "preloading" screen
		// until the application has finished loading.
		// It still "blinks" a bit in development mode
		// because CSS styles in development mode are included
		// not as `*.css` files but dynamically via javascript
		// by adding a `<style/>` DOM element, and that's why
		// in development mode styles are not applied immediately
		// in a web browser. In production mode CSS styles are
		// included as `*.css` files so they are applied immediately.
		initialLoadHideAnimationDuration: 160,
		initialLoadShowDelay: 0,
		InitialLoadComponent: PageLoading
	})
}