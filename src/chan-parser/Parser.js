export default class Parser {
	constructor({
		parseBoards,
		parseThreads,
		parseThread,
		...rest
	}) {
		this.options = rest
		this._parseBoards = parseBoards
		this._parseThreads = parseThreads
		this._parseThread = parseThread
	}

	parseBoards(response, options) {
		return this._parseBoards(response, {
			...this.options,
			...options
		})
	}

	parseThreads(response, options) {
		return this._parseThreads(response, {
			...this.options,
			...options
		})
	}

	parseThread(response, options) {
		return this._parseThread(response, {
			...this.options,
			...options
		})
	}
}