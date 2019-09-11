import Engine from '../../Engine'

import parseBoards from './board/parseBoardsResponse'
import parseThreads from './thread/parseThreadsResponse'
import parseThread from './thread/parseThreadResponse'

import PARSE_COMMENT_PLUGINS from './comment/parseCommentPlugins'
import KOHLCHAN_PARSE_COMMENT_PLUGINS from './comment/parseCommentPlugins.kohlchan'

export default class LynxChan extends Engine {
	constructor(chanSettings, options) {
		super(chanSettings, {
			...options,
			parseCommentPlugins: getParseCommentPlugins(chanSettings.id),
			parseBoards,
			parseThreads,
			parseThread
		})
	}
}

function getParseCommentPlugins(chan) {
	switch (chan) {
		case 'kohlchan':
			return KOHLCHAN_PARSE_COMMENT_PLUGINS
		default:
			return PARSE_COMMENT_PLUGINS
	}
}