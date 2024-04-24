import type { UserData } from '../types/index.js'

import React, { useContext } from 'react'

export const UserDataForUserDataCleanerContext = React.createContext(undefined)

export default function useUserDataForUserDataCleaner() {
	return useContext(UserDataForUserDataCleanerContext) as UserData
}