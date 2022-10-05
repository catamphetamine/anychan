module.exports = require('../frontend-lib/.postcssrc.json')

// `@import "react-responsive-ui/style.css";` in
// `frontend-lib/styles/react-responsive-ui.css`
// throws "module not found" error.
// This is a workaround for that.
// (`postcss-import` `root` option didn't seem to work).
module.exports.plugins['postcss-import'].resolve = (id, basedir, importOptions) => {
	if (/^react-responsive-ui/.test(id)) {
		const path = require('path')
		return path.join(__dirname, 'node_modules', id)
	}
	return id
}