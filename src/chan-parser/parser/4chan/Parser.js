import Parser from '../../Parser'

import parseBoards from './parseBoardsResponse'
import parseThreads from './parseThreadsResponse'
import parseThread from './parseThreadResponse'

import PARSE_COMMENT_PLUGINS from './parseCommentPlugins.4chan'
import EIGHT_CHAN_PARSE_COMMENT_PLUGINS from './parseCommentPlugins.8ch'
import LAIN_CHAN_PARSE_COMMENT_PLUGINS from './parseCommentPlugins.lainchan'
import ARISU_CHAN_PARSE_COMMENT_PLUGINS from './parseCommentPlugins.arisuchan'

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
		case 'lainchan':
			return LAIN_CHAN_PARSE_COMMENT_PLUGINS
		case 'arisuchan':
			return ARISU_CHAN_PARSE_COMMENT_PLUGINS
		default:
			return PARSE_COMMENT_PLUGINS
	}
}