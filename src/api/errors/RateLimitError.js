export default class RateLimitError extends Error {
	constructor() {
		super('Posting rate limit exceeded')
	}
}