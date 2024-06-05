export class RateLimitError extends Error {
	constructor() {
		super('Rate limit exceeded')
	}
}