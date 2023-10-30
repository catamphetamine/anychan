import { setAuthState } from '../../redux/auth.js'

export default function setInitialAuthState({ dispatch, dataSource, userData }) {
	const auth = userData.getAuth()
	if (auth) {
		const { accessToken } = auth
		if (accessToken) {
			dispatch(setAuthState({ accessToken }))
		}
	}
}