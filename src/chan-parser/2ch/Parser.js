import parseBoards from './parseBoards'
import parseThreads from './parseThreads'
import parseComments from './parseComments'

import PARSE_COMMENT_TEXT_PLUGINS from './parseCommentTextPlugins'

export default class DvachParser {
	constructor(options) {
		this.options = {
			...options,
			parseCommentTextPlugins: PARSE_COMMENT_TEXT_PLUGINS
		}
	}

	// Returns a `Promise`.
	parseBoards(response) {
		return parseBoards(response, this.options)
	}

	// Returns a `Promise`.
	parseThreads(response) {
		return parseThreads(response, this.options)
	}

	// Returns a `Promise`.
	parseComments(response) {
		return parseComments(response, this.options)
	}
}