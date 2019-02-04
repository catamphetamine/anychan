// Add ES6 polyfill (for older browsers).
require('@babel/polyfill')

// Maintain CSS styles order.
require('./styles/style.css')

// `chan-parser` self-test.
setTimeout(() => {
	require('./chan-parser/test')
})

// Run the application.
require('./initialize').default()
require('./render').default().catch(error => console.error(error))