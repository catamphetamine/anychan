import type { UserSettingsJson } from '@/types'
import type { Dispatch } from 'redux'

import { setSettingsFromCustomSettingsData } from '../../redux/settings.js'
import applySettings from './applySettings.js'
import getSettings from './getSettings.js'
import { migrateSettingsData, settingsDataRequiresMigration } from './UserSettings.js'

// Refreshes and re-applies settings on external change.
export default function onSettingsExternalChange({ dispatch, settings }: { dispatch: Dispatch, settings: UserSettingsJson }) {
	// Migrate the setings object if required.
	// User settings in local storage will not be affected and will be migrated separately later.
	// This migration is just to correctly apply the settings in the `applySettings()` call below.
	// The settings data in local storage won't be affected.
	if (settingsDataRequiresMigration(settings)) {
		migrateSettingsData(settings)
	}

	dispatch(setSettingsFromCustomSettingsData({ settings }))

	applySettings({
		dispatch,
		settings: getSettings({ settings })
	})
}