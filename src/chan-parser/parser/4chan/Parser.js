import Parser from '../../Parser'

import parseBoards from './parseBoardsResponse'
import parseThreads from './parseThreadsResponse'
import parseThread from './parseThreadResponse'

import PARSE_COMMENT_PLUGINS from './parseCommentPlugins.4chan'
import EIGHT_CHAN_PARSE_COMMENT_PLUGINS from './parseCommentPlugins.8ch'
import KOHLCHAN_PARSE_COMMENT_PLUGINS from './parseCommentPlugins.kohlchan'
import LAINCHAN_PARSE_COMMENT_PLUGINS from './parseCommentPlugins.lainchan'

export default class FourChanParser extends Parser {
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
		case '8ch':
			return EIGHT_CHAN_PARSE_COMMENT_PLUGINS
		case 'kohlchan':
			return KOHLCHAN_PARSE_COMMENT_PLUGINS
		case 'lainchan':
			return LAINCHAN_PARSE_COMMENT_PLUGINS
		default:
			return PARSE_COMMENT_PLUGINS
	}
}