import Parser from '../Parser'

import parseBoards from './parseBoards'
import parseThreads from './parseThreads'
import parseComments from './parseComments'

import PARSE_COMMENT_PLUGINS from './parseCommentPlugins'

export default class TwoChannelParser extends Parser {
	constructor(options) {
		super({
			...options,
			plugins: PARSE_COMMENT_PLUGINS,
			parseBoards,
			parseThreads,
			parseComments
		})
	}
}