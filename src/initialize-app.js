import getUserSettings from './UserSettings.js'
import getUserData from './UserData.js'
import applySettings from './utility/settings/applySettings.js'
import { setDefaultThemes } from './utility/settings/settingsDefaults.js'
import getDefaultThemes from './utility/getDefaultThemes.js'
import { delayedDispatch } from './utility/dispatch.js'
import migrate, { requiresMigration } from './utility/migrate.js'
import onUserDataExternalChange from './UserData/onUserDataExternalChange.js'
import onSettingsExternalChange from './utility/settings/onSettingsExternalChange.js'
import addUserDataExternalChangeListener from './UserData/addUserDataExternalChangeListener.js'
import exclusiveExecution from './utility/exclusiveExecution.js'

export default async function() {
	const dispatch = delayedDispatch

	// Setting default themes' `*.css` file URLs here instead of directly in
	// `./utility/settingsDefaults.js` because those `*.css` files' URLs
	// can only be obtained when running a Webpack build and they wouldn't work
	// when running console tests.
	setDefaultThemes(getDefaultThemes())

	const userData = getUserData()
	const userSettings = getUserSettings()

	// Listen to `userData` changes coming from other browser tabs.
	addUserDataExternalChangeListener({
		dispatch,
		userData
	})

	userData.start()

	// Apply user settings.
	applySettings({ dispatch, userSettings })

	// Listen to settings changes coming from other browser tabs.
	userSettings.onExternalChange(() => {
		onSettingsExternalChange({ dispatch, userSettings })
	})

	// Migrate `localStorage` data.
	await exclusiveExecution(async () => {
		migrate({
			collections: userData.collections
		})
	}, {
		name: 'Migration',
		timeout: 60 * 1000,
		condition: () => requiresMigration()
	})

	// Migrate User Data.
	await exclusiveExecution(async () => {
		userData.migrate()
	}, {
		name: 'User-Data-Migration',
		timeout: 60 * 1000,
		condition: () => userData.requiresMigration()
	})

	// Migrate User Settings.
	await exclusiveExecution(async () => {
		userSettings.migrate()
	}, {
		name: 'User-Settings-Migration',
		timeout: 60 * 1000,
		condition: () => userSettings.requiresMigration()
	})

	return {
		userData,
		userSettings
	}
}