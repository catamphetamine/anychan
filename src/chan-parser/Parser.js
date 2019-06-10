import getChanSettings from './chan/getChanSettings'

export default class Parser {
	constructor(chanIdOrChanSettings, {
		parseBoards,
		parseThreads,
		parseThread,
		...rest
	}) {
		if (typeof chanIdOrChanSettings === 'string') {
			const chanId = chanIdOrChanSettings
			rest.chan = chanId
			chanIdOrChanSettings = getChanSettings(chanId)
		}
		this.options = {
			...chanIdOrChanSettings,
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