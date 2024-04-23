// `core-js` and `regenerator-runtime` would've been imported here
// in case of using `useBuiltIns: 'entry'` option of `@babel/preset-env`
// https://stackoverflow.com/questions/52625979/confused-about-usebuiltins-option-of-babel-preset-env-using-browserslist-integ
// https://babeljs.io/docs/en/babel-preset-env
//
// When using `useBuiltIns: 'auto'`, importing `core-js` and `regenerator-runtime`
// explicitly is not required, and Babel adds those automatically.
//
// SWC mimicks this feature of Babel's `preset-env`:
// https://swc.rs/docs/configuration/supported-browsers
//
// This project uses `mode: 'usage'` flag of SWC.
// * In this repo's `.swcrc`
// * In `frontend-lib` repo's `.swcrc`
// * In `social-components-react` repo's `.swcrc`
//
// // ES6 polyfill.
// import 'core-js/stable'
// // `async/await` support.
// import 'regenerator-runtime/runtime'

// CSS styles.
// Should be loaded before any `*.js` imports
// because `*.js` files import `*.css` files too,
// and those should be applied over the default styles
// that're defined in `./styles/style.css`.
import './styles/style.css'

import initializeMiscellaneous from './initialize-miscellaneous.js'
import initializeIntl from './initialize-intl.js'
import initializeResources from './initialize-resources.js'
import initializeDataSource from './initialize-dataSource.js'
import initializeUserSettings from './initialize-userSettings.js'
import renderApp from './render.js'
import renderNoDataSourcePage from './renderNoDataSourcePage.ts'

// Run the application.
// First initialize error handlers and stuff.
// Then initialize the currently used dataSource
// because it's used as a prefix in settings and user data.
// Then initialize the app (applies user settings for the dataSource).
//
// `require()` is used instead of `import` because the proveder
// has to be initialized before the other code is included on a page,
// otherwise that other code would include things like `UserData.js`
// before the data source is initialized and hence with an incorrect `prefix`.
//
async function run() {
	try {
		initializeMiscellaneous()
		initializeIntl()
		initializeResources()

		const {
			dataSource,
			dataSourceAlias,
			multiDataSource
		} = initializeDataSource()

		await initializeUserSettings({
			dataSource,
			multiDataSource
		})

		await renderApp({
			dataSource,
			dataSourceAlias,
			multiDataSource
		})
	} catch (error) {
		if (error.message === 'NO_DATA_SOURCE') {
			await renderNoDataSourcePage()
		} else {
			console.error(error.stack || error)
			alert(error.message)
		}
	}
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', function() {
		run()
	})
} else {
	run()
}