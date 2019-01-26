require('@babel/register')({
	// https://github.com/babel/babel/issues/8309
  // Since babel ignores all files outside the cwd, it does not compile sibling packages
  // So rewrite the ignore list to only include node_modules
  ignore: ['node_modules']
})
module.exports = require('./webpack.config.server.development.babel.babel').default