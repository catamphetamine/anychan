import NotFoundError from '../errors/NotFoundError.js'
import RateLimitError from '../errors/RateLimitError.js'
import AuthTokenNotFoundOrIncorrectSecret from '../errors/AuthTokenNotFoundOrIncorrectSecret.js'
import InvalidAuthToken from '../errors/InvalidAuthToken.js'

export default async function logIn(imageboard, parameters) {
	try {
		return await imageboard.logIn({
			...parameters,
			// For some weird reason, even with `SameSite=None` and `Secure`,
			// `Set-Cookie` headers were ignored (an unreadable) by the web browser
			// when using the `fetch()` call below.
			// A random suggestion of adding `HttpOnly` also didn't work (obviously):
			// https://stackoverflow.com/a/67001424/970769
			// The workaround is simple: just copy the value of `Set-Cookie` header
			// to some other header when sending the response.
			// Setting `x-set-cookie-httponly` header to `true`
			// instructs `anychan-proxy` to copy the value of `Set-Cookie` header
			// to `x-set-cookie` header.
			setCookieHeaderName: 'x-set-cookie'
		})
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