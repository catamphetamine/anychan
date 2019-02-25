import parseBoards from './parseBoards'
import parseThreads from './parseThreads'
import parseComments from './parseComments'

import compileFilters from '../compileFilters'

import PARSE_COMMENT_TEXT_PLUGINS from './parseCommentTextPlugins'

export default class DvachParser {
	constructor({ messages, filters }) {
		this.options = {
			messages,
			filters: filters ? compileFilters(filters) : undefined,
			parseCommentTextPlugins: PARSE_COMMENT_TEXT_PLUGINS
		}
	}

	parseBoards(response) {
		return parseBoards(response, this.options)
	}

	parseThreads(response, { boardId }) {
		return parseThreads(response, {
			...this.options,
			boardId
		})
	}

	parseComments(response, { boardId }) {
		return parseComments(response, {
			...this.options,
			boardId
		})
	}
}