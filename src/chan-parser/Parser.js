const TRAILING_SLASH_REGEXP = /\/$/

export default class Parser {
	constructor(chanSettings, {
		parseBoards,
		parseThreads,
		parseThread,
		useRelativeUrls,
		...rest
	}) {
		const {
			id,
			url,
			...restChanSettings
		} = chanSettings
		const chanUrl = url.replace(TRAILING_SLASH_REGEXP, '')
		function toAbsoluteUrl(url) {
			// Convert relative URLs to absolute ones.
			if (!useRelativeUrls) {
				if (url[0] === '/' && url[1] !== '/') {
					return chanUrl + url
				}
			}
			return url
		}
		this.options = {
			chan: id,
			toAbsoluteUrl,
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

	getOptions(options) {
		return {
			...this.options,
			...options
		}
	}

	/**
	 * Parses chan "get boards list" API response.
	 * @param  {any} response
	 * @return {object[]}
	 */
	parseBoards(response) {
		return this._parseBoards(response, this.getOptions())
	}

	/**
	 * Parses chan "get threads list" API response.
	 * @param  {any} response
	 * @param  {object} [options] — See the "Available `options`" section of `chan-parser` README.
	 * @return {object[]}
	 */
	parseThreads(response, options) {
		return this._parseThreads(response, this.getOptions(options))
	}

	/**
	 * Parses chan "get thread comments" API response.
	 * @param  {any} response
	 * @param  {object} [options] — See the "Available `options`" section of `chan-parser` README.
	 * @return {object[]}
	 */
	parseThread(response, options) {
		return this._parseThread(response, this.getOptions(options))
	}
}