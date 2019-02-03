module.exports = require('../webapp-frontend/postcss.config')

// `root` option doesn't seem to work.
module.exports.plugins['postcss-import'].resolve = (id, basedir, importOptions)=> {
	if (/^react-responsive-ui/.test(id)) {
		const path = require('path')
		return path.join(__dirname, 'node_modules', id)
	}
	return id
}