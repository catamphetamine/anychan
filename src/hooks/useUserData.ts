import type { UserData } from '../types/index.js'

import React, { useContext } from 'react'

export const UserDataContext = React.createContext(undefined)

export default function useUserData() {
	const userData = useContext(UserDataContext)
	if (!userData) {
		throw new Error('`userData` is not defined')
	}
	return userData as UserData
}