// import parseBoards from './parseBoards'
// import parseThreads from './parseThreads'
// import parseComments from './parseComments'

import PARSE_COMMENT_TEXT_PLUGINS from './parseCommentTextPlugins'

export default class FourChanParser {
	constructor(options) {
		this.options = {
			...options,
			parseCommentTextPlugins: PARSE_COMMENT_TEXT_PLUGINS,
			getAttachmentUrl(path, { boardId }) {
				return `https://i.4cdn.org/${boardId}${path}`
			}
		}
	}

	parseBoards(response) {
		// return parseBoards(response, this.options)
	}

	parseThreads(response) {
		// return parseThreads(response, this.options)
	}

	parseComments(response) {
		// return parseComments(response, this.options)
	}
}