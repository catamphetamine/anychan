import Parser from '../Parser'

import parseBoards from './parseBoardsResponse'
import parseThreads from './parseThreadsResponse'
import parseThread from './parseThreadResponse'

import PARSE_COMMENT_PLUGINS from './parseCommentPlugins'

export default class FourChanParser extends Parser {
	constructor(options) {
		super({
			...options,
			plugins: PARSE_COMMENT_PLUGINS,
			parseBoards,
			parseThreads,
			parseThread
		})
	}
}