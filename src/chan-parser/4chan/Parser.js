import Parser from '../Parser'

import parseBoards from './parseBoardsResponse'
import parseThreads from './parseThreadsResponse'
import parseThread from './parseThreadResponse'

import PARSE_COMMENT_PLUGINS from './parseCommentPlugins.4chan'
import EIGHT_CHAN_PARSE_COMMENT_PLUGINS from './parseCommentPlugins.8ch'
import KOHLCHAN_PARSE_COMMENT_PLUGINS from './parseCommentPlugins.kohlchan'

export default class FourChanParser extends Parser {
	constructor(chanId, options) {
		super(chanId, {
			...options,
			parseCommentPlugins: getParseCommentPlugins(options.chan),
			parseBoards,
			parseThreads,
			parseThread
		})
	}
}

function getParseCommentPlugins(chan) {
	switch (chan) {
		case '8ch':
			return EIGHT_CHAN_PARSE_COMMENT_PLUGINS
		case 'kohlchan':
			return KOHLCHAN_PARSE_COMMENT_PLUGINS
		default:
			return PARSE_COMMENT_PLUGINS
	}
}