const path = require('path')
const configuration = require('../webpack.config')

configuration.output.publicPath = '/'
// configuration.output.path = path.join(configuration.context, 'build')

module.exports = configuration