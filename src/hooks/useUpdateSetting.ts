import type { UserSettingsJson } from '@/types'

import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import useSettings from './useSettings.js'

import { refreshSettings } from '../redux/settings.js'

export default function useUpdateSetting() {
	const dispatch = useDispatch()
	const userSettings = useSettings()

	return useCallback(<K extends keyof UserSettingsJson>(key: K, value?: UserSettingsJson[K]) => {
		// Update the setting in the storage.
		userSettings.set(key, value)

		// Some settings are inter-related, so when changing one,
		// another might be required to be changed too.
		switch (key) {
			case 'autoDarkMode':
				// Reset manual "Dark Mode" setting.
				userSettings.set('darkMode', undefined)
				break
			case 'darkMode':
				// Disable "Auto Dark Mode" feature.
				userSettings.set('autoDarkMode', false)
				break
		}

		// Refresh settings.
		dispatch(refreshSettings({ userSettings }))
	}, [dispatch, userSettings])
}