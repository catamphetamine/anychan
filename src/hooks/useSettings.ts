import type { UserSettings } from '../types/index.js'

import React, { useContext } from 'react'

export const SettingsContext = React.createContext(undefined)

export default function useSettings() {
	const userSettings = useContext(SettingsContext)
	if (!userSettings) {
		throw new Error('`userSettings` are not defined')
	}
	return userSettings as UserSettings
}