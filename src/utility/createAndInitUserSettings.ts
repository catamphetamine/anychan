import type { DataSource, UserSettings } from '@/types'
import type { Dispatch } from 'redux'

import createUserSettings from '../createUserSettings.js'
import onSettingsExternalChange from './settings/onSettingsExternalChange.js'

export default function createAndInitUserSettings({
	dataSource,
	multiDataSource,
	dispatch
}: {
	dataSource: DataSource,
	multiDataSource: boolean,
	dispatch: Dispatch
}) {
	const userSettings = createUserSettings({
		dataSource,
		multiDataSource
	})

	// Listen to settings changes coming from other browser tabs.
	userSettings.onExternalChange(() => {
		// Refreshes and re-applies settings on external change.
		onSettingsExternalChange({
			dispatch,
			settings: userSettings.get()
		})
	})

	return {
		userSettings
	}
}