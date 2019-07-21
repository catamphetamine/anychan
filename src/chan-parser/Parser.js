const TRAILING_SLASH_REGEXP = /\/$/

export default class Parser {
	constructor(chanSettings, {
		parseBoards,
		parseThreads,
		parseThread,
		...rest
	}) {
		const {
			id,
			url,
			...restChanSettings
		} = chanSettings
		this.options = {
			chan: id,
			chanUrl: url.replace(TRAILING_SLASH_REGEXP, ''),
			...restChanSettings,
			...rest
		}
		// Compile `commentUrlRegExp`.
		if (this.options.commentUrlRegExp) {
			this.options.commentUrlRegExp = new RegExp(this.options.commentUrlRegExp)
		}
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