import React, { useContext } from 'react'

export const UserDataContext = React.createContext()

export default function useUserData() {
	return useContext(UserDataContext)
}