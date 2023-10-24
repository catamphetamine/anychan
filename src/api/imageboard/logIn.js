import NotFoundError from '../errors/NotFoundError.js'
import RateLimitError from '../errors/RateLimitError.js'

export default async function logIn(imageboard, parameters) {
	try {
		return await imageboard.logIn(parameters)
	} catch (error) {
		switch (error.message) {
			case 'NOT_FOUND':
				throw new NotFoundError()
			case 'RATE_LIMIT_EXCEEDED':
				throw new RateLimitError()
			default:
				throw error
		}
	}
}