import Parser from '../../Parser'

import parseBoards from './parseBoardsResponse'
import parseThreads from './parseThreadsResponse'
import parseThread from './parseThreadResponse'

import PARSE_COMMENT_PLUGINS from './parseCommentPlugins'

export default class TwoChannelParser extends Parser {
	constructor(chanSettings, options) {
		super(chanSettings, {
			...options,
			parseCommentPlugins: PARSE_COMMENT_PLUGINS,
			parseBoards,
			parseThreads,
			parseThread
		})
	}
}