import Engine from '../../Engine'

import parseBoards from './board/parseBoardsResponse'
import parseThreads from './thread/parseThreadsResponse'
import parseThread from './thread/parseThreadResponse'

import PARSE_COMMENT_PLUGINS from './comment/parseCommentPlugins'

export default class Makaba extends Engine {
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