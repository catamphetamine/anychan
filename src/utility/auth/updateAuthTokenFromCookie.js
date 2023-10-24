import { setAccessToken } from '../../redux/auth.js'

export default function updateAuthTokenFromCookie({ dispatch, dataSource }) {
	// If the data source uses server-side-set cookies for authentication,
	// read the existing access token from such cookie.
	if (dataSource.readAccessTokenFromCookie) {
		const accessToken = dataSource.readAccessTokenFromCookie()
		if (accessToken) {
			dispatch(setAccessToken(accessToken))
		}
	}
}