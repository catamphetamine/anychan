import NotFoundError from '../errors/NotFoundError.js'
import RateLimitError from '../errors/RateLimitError.js'
import AuthTokenNotFoundOrIncorrectSecret from '../errors/AuthTokenNotFoundOrIncorrectSecret.js'
import InvalidAuthToken from '../errors/InvalidAuthToken.js'

export default async function logIn(imageboard, parameters) {
	try {
		return await imageboard.logIn(parameters)
	} catch (error) {
		switch (error.message) {
			case 'NOT_FOUND':
				throw new NotFoundError()
			case 'RATE_LIMIT_EXCEEDED':
				throw new RateLimitError()
			case 'INVALID_TOKEN':
				throw new InvalidAuthToken()
			case 'TOKEN_NOT_FOUND_OR_INCORRECT_PIN':
				throw new AuthTokenNotFoundOrIncorrectSecret()
			default:
				throw error
		}
	}
}