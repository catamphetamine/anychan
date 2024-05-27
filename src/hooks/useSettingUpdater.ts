import type { UserSettingsJson } from '@/types'

import { useCallback } from 'react'

import useSaveInSettings from './useUpdateSetting.js'

export default function useSettingUpdater<K extends keyof UserSettingsJson>(key: K) {
	const saveInSettings = useSaveInSettings()

	return useCallback((value: UserSettingsJson[K]) => {
		saveInSettings(key, value)
	}, [saveInSettings])
}