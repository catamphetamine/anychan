import createUserSettings from '../createUserSettings.js'
import onSettingsExternalChange from './settings/onSettingsExternalChange.js'

export default function createAndInitUserSettings({
	dataSource,
	multiDataSource,
	dispatch
}) {
	const userSettings = createUserSettings({
		dataSource,
		multiDataSource,
		dispatch
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