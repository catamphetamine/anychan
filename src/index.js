// Add ES6 polyfill (for older browsers).
require('@babel/polyfill')

// Maintain CSS styles order.
require('./styles/style.css')

if (process.env.NODE_ENV !== 'production') {
	// `chan-parser` self-test.
	setTimeout(() => require('./chan-parser/test'))

	// `webapp-frontend/src/utility` self-test.
	setTimeout(() => require('webapp-frontend/src/utility/test'))
}

// Run the application.
require('./initialize').default()
require('./render').default().catch(error => console.error(error))