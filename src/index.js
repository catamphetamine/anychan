// Add ES6 polyfill (for older browsers).
require('@babel/polyfill')

// Maintain CSS styles order.
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
require('./render').default().catch(error => console.error(error))