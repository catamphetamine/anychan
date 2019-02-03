const merge = require('lodash/merge')
const path = require('path')
const fs = require('fs')

const defaultConfiguration = require('./default.json')

let customConfiguration
if (fs.existsSync(path.join(__dirname, 'configuration.json'))) {
	customConfiguration = require(path.join(__dirname, 'configuration.json'))
}

const configuration = merge({}, defaultConfiguration, customConfiguration)

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

module.exports = configuration