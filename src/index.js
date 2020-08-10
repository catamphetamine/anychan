// ES6 polyfill.
require('core-js/stable')
// `async/await` support.
require('regenerator-runtime/runtime')

// https://github.com/gaearon/react-hot-loader
// "Make sure `react-hot-loader` is required before `react` and `react-dom`".
require('react-hot-loader');

// CSS styles.
require('./styles/style.css')

if (process.env.NODE_ENV !== 'production') {
	// Self-test.
	setTimeout(() => require('./test'))

	// `webapp-frontend/src/utility` self-test.
	setTimeout(() => require('webapp-frontend/src/utility/test'))
}

// Run the application.
// First initialize error handlers and stuff.
// Then initialize the currently used chan
// because it's used as a prefix in settings and user data.
// Then initialize the app (applies user settings for the chan).
require('./initialize-entry')
require('./initialize-chan').default()
require('./initialize').default()
require('./render').default().catch((error) => {
	console.error(error.stack || error)
	alert('Error')
})