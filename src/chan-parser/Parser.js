import parseBoards from './parseBoards'
import parseThreads from './parseThreads'
import parseComments from './parseComments'

export default class Parser {
	constructor(options) {
		// `options` could be used for chan parsing specifics.
		// (2ch.hk, 4chan.org, etc)
		this.options = options
	}

	parseBoards(response) {
		return parseBoards(response, this.options)
	}

	parseThreads(response) {
		return parseThreads(response, this.options)
	}

	parseComments(response) {
		return parseComments(response, this.options)
	}
}