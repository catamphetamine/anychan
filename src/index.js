// Add ES6 polyfill (for older browsers).
require('@babel/polyfill')

// Maintain CSS styles order.
require('./styles/style.css')

if (process.env.NODE_ENV !== 'production') {
	// Self-test.
	setTimeout(() => require('./test'))

	// `chan-parser` self-test.
	setTimeout(() => require('./chan-parser/test'))

	// `webapp-frontend/src/utility` self-test.
	setTimeout(() => require('webapp-frontend/src/utility/test'))
}

if (process.env.NODE_ENV !== 'production') {
	window.TWO_CHANNEL_BOARDS_RESPONSE_EXAMPLE = require('./chan-parser/2ch/test.data').BOARDS_RESPONSE_EXAMPLE
}

// Run the application.
require('./initialize').default()
require('./render').default().catch(error => console.error(error))