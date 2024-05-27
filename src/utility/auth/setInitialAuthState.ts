import type { Dispatch } from 'redux'
import type { DataSource, UserData } from '@/types'

import { setAuthState } from '../../redux/auth.js'

export default function setInitialAuthState({ dispatch, dataSource, userData }: {
	dispatch: Dispatch,
	dataSource: DataSource,
	userData: UserData
}) {
	const auth = userData.getAuth()
	if (auth) {
		const { accessToken } = auth
		if (accessToken) {
			dispatch(setAuthState({ accessToken }))
		}
	}
}