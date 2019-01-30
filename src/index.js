// Add ES6 polyfill (for older browsers).
require('@babel/polyfill')

// Maintain CSS styles order.
require('./styles/style.css')

const getBasePath = require('./getBasePath').default
const onError = require('webapp-frontend/src/onRenderError').default

// Run the application.
require('./render').default().catch(error => onError(error, { basePath: getBasePath() }))