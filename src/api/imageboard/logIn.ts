import type { Imageboard } from 'imageboard'
import type { LogInParameters, LogInResult } from '../../types/index.js'

import {
	NotFoundError,
	RateLimitError,
	AuthTokenNotFoundOrIncorrectSecret,
	InvalidAuthToken
} from '../errors/index.js'

export default async function logIn(imageboard: Imageboard, parameters: LogInParameters): Promise<LogInResult> {
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