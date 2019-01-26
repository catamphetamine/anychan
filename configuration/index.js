import merge from 'lodash/merge'

import defaultConfiguration from './configuration.default'
import developmentConfiguration from './configuration.development'
import productionConfiguration from './configuration.production'

const configuration = merge({}, defaultConfiguration)

// https://github.com/webpack-contrib/webpack-serve/issues/81#issuecomment-378469110
export default configuration

if (process.env.NODE_ENV === 'production') {
	merge(configuration, productionConfiguration)
} else {
	merge(configuration, developmentConfiguration)
}

// For services like Amazon Elastic Compute Cloud and Heroku
if (process.env.PORT) {
	configuration.webserver.port = process.env.PORT
}

// For passing custom configuration via an environment variable.
// For frameworks like Docker.
// E.g. `CONFIGURATION="{ \"key\": \"value\" }" npm start`.
if (process.env.CONFIGURATION) {
	try {
		merge(configuration, JSON.parse(process.env.CONFIGURATION))
	} catch (error) {
		console.error(error)
	}
}