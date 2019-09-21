import parseCommentContent from './parseCommentContent'

export default class Engine {
	constructor(chanSettings, {
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
			parseCommentContent: this.parseCommentContent,
			...restChanSettings,
			...rest
		}
		// Compile `commentUrlParser`.
		if (this.options.commentUrlParser) {
			this.options.commentUrlParser = new RegExp(this.options.commentUrlParser)
		}
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
	 * Returns `true` if an imageboard has a "get all boards" API endpoint
	 * that's different from the regular "get boards" API endpoint.
	 * In other words, returns `true` if an imageboard provides separate API
	 * endpoints for getting a list of "most popular boards" and a list of
	 * "all boards available".
	 * @return {boolean}
	 */
	hasMoreBoards() {
		return this.options.api.getAllBoards !== undefined
	}

	/**
	 * Performs a "get threads list" API query and parses the response.
	 * @param  {object} parameters — `{ boardId }`.
	 * @param  {object} [options] — See the README.
	 * @return {object[]} — A list of `Thread` objects.
	 */
	async getThreads(parameters, options) {
		// The API endpoint URL.
		const url = setParameters(this.options.api.getThreads, parameters)
		// Query the API endpoint.
		const response = await this.request('GET', this.toAbsoluteUrl(url))
		// Parse the threads list.
		// `boardId` is still used there.
		return this.parseThreads(response, {
			...parameters,
			...options
		})
	}

	/**
	 * Performs a "get thread comments" API query and parses the response.
	 * @param  {object} parameters — `{ boardId, threadId }`.
	 * @param  {object} [options] — See the README.
	 * @return {object} — A `Thread` object.
	 */
	async getThread(parameters, options) {
		// The API endpoint URL.
		const url = setParameters(this.options.api.getThread, parameters)
		// Query the API endpoint.
		const response = await this.request('GET', this.toAbsoluteUrl(url))
		// Parse the thread comments list.
		// `boardId` and `threadId` are still used there.
		return this.parseThread(response, {
			...parameters,
			...options
		})
	}

	/**
	 * Performs a "vote" API request and parses the response.
	 * @param  {object} parameters — `{ boardId, threadId, commentId, up }`.
	 * @return {boolean} — Returns `true` if the vote has been accepted.  Returns `false` if the user has already voted for this thread or comment.
	 */
	async vote(params) {
		const voteApi = this.options.api.vote
		const method = voteApi.method
		const parameters = getVoteParameters(voteApi, params)
		// The API endpoint URL.
		const url = this.toAbsoluteUrl(setParameters(voteApi.url, parameters))
		// Send a request to the API endpoint.
		// Strangely, `2ch.hk` requires sending a `GET` HTTP request in order to vote.
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
		return this.parseVoteResponse(response)
	}

	/**
	 * Can be used when `parseContent: false` option is passed.
	 * @param {object} comment
	 * @param {object} [options] — `{ threadId }` if `threadId` isn't already part of `this.options`.
	 */
	parseCommentContent = (comment, options) => {
		// `post-link` parser uses `boardId` and `threadId`
		// for parsing links like `4chan`'s `href="#p265789424"`
		// that're present in "get thread comments" API response.
		if (!options.boardId || !options.threadId) {
			console.error('`boardId` and `threadId` options are required when parsing thread comments.')
		}
		parseCommentContent(comment, this.getOptions(options))
	}
}

function setParameters(string, parameters) {
	for (const key of Object.keys(parameters)) {
		string = string.replace('{' + key + '}', parameters[key])
	}
	return string
}

function getVoteParameters(voteApi, parameters) {
	const {
		params,
		voteParam,
		voteParamUp,
		voteParamDown
	} = voteApi
	if (params) {
		const voteParameters = JSON.parse(setParameters(params, parameters))
		if (voteParam) {
			voteParameters[voteParam] = parameters.up ? voteParamUp : voteParamDown
		}
		return voteParameters
	}
}

function addUrlParameters(url, parameters) {
	if (parameters) {
		return url + '?' + Object.keys(parameters).map(key => `${key}=${parameters[key]}`).join('&')
	}
	return url
}