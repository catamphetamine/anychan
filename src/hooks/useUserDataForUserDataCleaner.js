import React, { useContext } from 'react'

export const UserDataForUserDataCleanerContext = React.createContext()

export default function useUserDataForUserDataCleaner() {
	return useContext(UserDataForUserDataCleanerContext)
}