export default class Engine {
	constructor(chanSettings, {
		parseBoards,
		parseThreads,
		parseThread,
		parseVoteResponse,
		useRelativeUrls,
		request,
		...rest
	}) {
		const {
			id,
			domain,
			...restChanSettings
		} = chanSettings
		if (!useRelativeUrls) {
			this._baseUrl = `https://${domain}`
		}
		this.request = request
		this.options = {
			chan: id,
			toAbsoluteUrl: this.toAbsoluteUrl,
			commentUrl: '/{boardId}/{threadId}#{commentId}',
			...restChanSettings,
			...rest
		}
		// Compile `commentUrlParser`.
		if (this.options.commentUrlParser) {
			this.options.commentUrlParser = new RegExp(this.options.commentUrlParser)
		}
		this.parseBoards = (response, options) => parseBoards(response, this.getOptions(options))
		this.parseThreads = (response, options) => parseThreads(response, this.getOptions(options))
		this.parseThread = (response, options) => parseThread(response, this.getOptions(options))
		this.parseVoteResponse = (response, options) => parseVoteResponse(response, this.getOptions(options))
	}

	getOptions(options) {
		return {
			...this.options,
			...options
		}
	}

	toAbsoluteUrl = (url) => {
		// Convert relative URLs to absolute ones.
		if (this._baseUrl) {
			if (url[0] === '/' && url[1] !== '/') {
				return this._baseUrl + url
			}
		}
		return url
	}

	/**
	 * Performs a "get boards list" API query and parses the response.
	 * @param  {object} [options] — See the README.
	 * @return {object[]} — A list of `Board` objects.
	 */
	async getBoards(options) {
		// Some "legacy" chans don't provide `/boards.json` API
		// so their boards list is defined as a static one in JSON configuration.
		if (this.options.boards) {
			return this.options.boards
		}
		// The API endpoint URL.
		const url = options.all ?
			this.options.api.getAllBoards || this.options.api.getBoards :
			this.options.api.getBoards
		// Validate configuration.
		if (!url) {
			throw new Error('Neither "boards" nor "api.getBoards" parameters were found in chan config')
		}
		// Query the API endpoint.
		const response = await this.request('GET', this.toAbsoluteUrl(url))
		// Parse the boards list.
		return this.parseBoards(response, options)
	}

	/**
	 * Performs a "get all boards list" API query and parses the response.
	 * @param  {object} [options] — See the README.
	 * @return {object[]} — A list of `Board` objects.
	 */
	async getAllBoards(options) {
		return await this.getBoards({
			...options,
			all: true
		})
	}

	/**
	 * Performs a "get threads list" API query and parses the response.
	 * @param  {object} [options] — See the README.
	 * @return {object[]} — A list of `Thread` objects.
	 */
	async getThreads(options) {
		// The API endpoint URL.
		const url = this.options.api.getThreads
			.replace('{boardId}', options.boardId)
		// Query the API endpoint.
		const response = await this.request('GET', this.toAbsoluteUrl(url))
		// Parse the threads list.
		return this.parseThreads(response, options)
	}

	/**
	 * Performs a "get thread comments" API query and parses the response.
	 * @param  {object} [options] — See the README.
	 * @return {object} — A `Thread` object.
	 */
	async getThread(options) {
		// The API endpoint URL.
		const url = this.options.api.getThread
			.replace('{boardId}', options.boardId)
			.replace('{threadId}', options.threadId)
		// Query the API endpoint.
		const response = await this.request('GET', this.toAbsoluteUrl(url))
		// Parse the thread comments list.
		return this.parseThread(response, options)
	}

	/**
	 * Performs a "vote" API request and parses the response.
	 * @param  {object} [options] — See the README.
	 * @return {boolean} — `true` if the vote has been accepted.
	 */
	async vote(options) {
		// The API endpoint URL.
		const url = this.toAbsoluteUrl(setParameters(this.options.api.vote.url, options))
		// Send a request to the API endpoint.
		// Strangely, `2ch.hk` requires sending a `GET` HTTP request in order to vote.
		const voteApi = this.options.api.vote
		const method = voteApi.method
		const parameters = getParameters(voteApi, options)
		let response
		switch (method) {
			case 'GET':
				response = await this.request('GET', addUrlParameters(url, parameters))
				break
			default:
				response = await this.request(method, url, parameters)
				break
		}
		// Parse vote status.
		return this.parseVoteResponse(response, options)
	}
}

function setParameters(string, options) {
	return string
		.replace('{boardId}', options.boardId)
		.replace('{commentId}', options.commentId)
}

function getParameters(voteApi, options) {
	const {
		params,
		voteParam,
		voteParamUp,
		voteParamDown
	} = voteApi
	if (params) {
		const parameters = JSON.parse(setParameters(params, options))
		if (voteParam) {
			parameters[voteParam] = options.up ? voteParamUp : voteParamDown
		}
		return parameters
	}
}

function addUrlParameters(url, parameters) {
	if (parameters) {
		return url + '?' + Object.keys(parameters).map(key => `${key}=${parameters[key]}`).join('&')
	}
	return url
}