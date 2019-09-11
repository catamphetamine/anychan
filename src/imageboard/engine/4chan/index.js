import Engine from '../../Engine'

import parseBoards from './board/parseBoardsResponse'
import parseThreads from './thread/parseThreadsResponse'
import parseThread from './thread/parseThreadResponse'

import PARSE_COMMENT_PLUGINS from './comment/parseCommentPlugins.4chan'
import EIGHT_CHAN_PARSE_COMMENT_PLUGINS from './comment/parseCommentPlugins.8ch'
import LAIN_CHAN_PARSE_COMMENT_PLUGINS from './comment/parseCommentPlugins.lainchan'
import ARISU_CHAN_PARSE_COMMENT_PLUGINS from './comment/parseCommentPlugins.arisuchan'

export default class FourChan extends Engine {
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