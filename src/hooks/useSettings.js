import React, { useContext } from 'react'

export const SettingsContext = React.createContext()

export default function useSettings() {
	return useContext(SettingsContext)
}