export default class Parser {
	constructor({
		messages,
		filters,
		plugins,
		parseBoards,
		parseThreads,
		parseComments,
		commentLengthLimit
	}) {
		this.options = {
			messages,
			filters,
			commentLengthLimit,
			parseCommentPlugins: plugins
		}
		this._parseBoards = parseBoards
		this._parseThreads = parseThreads
		this._parseComments = parseComments
	}

	parseBoards(response) {
		return this._parseBoards(response, this.options)
	}

	parseThreads(response, { boardId }) {
		return this._parseThreads(response, {
			...this.options,
			boardId
		})
	}

	parseComments(response, { boardId }) {
		return this._parseComments(response, {
			...this.options,
			boardId
		})
	}
}