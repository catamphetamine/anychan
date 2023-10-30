import getUserSettings from './UserSettings.js'
import { migrateSettingsData, settingsDataRequiresMigration } from './utility/settings/UserSettings.js'
import getUserData from './UserData.js'
import applySettings from './utility/settings/applySettings.js'
import { setDefaultThemes } from './utility/settings/settingsDefaults.js'
import getSettings from './utility/settings/getSettings.js'
import getDefaultThemes from './utility/getDefaultThemes.js'
import { delayedDispatch } from './utility/dispatch.js'
import migrate, { requiresMigration } from './utility/migrate.js'
import onUserDataExternalChange from './UserData/onUserDataExternalChange.js'
import onSettingsExternalChange from './utility/settings/onSettingsExternalChange.js'
import addUserDataExternalChangeListener from './UserData/addUserDataExternalChangeListener.js'
import exclusiveExecution from './utility/exclusiveExecution.js'
import setInitialAuthState from './utility/auth/setInitialAuthState.js'

export default async function({ dataSource }) {
	const dispatch = delayedDispatch

	// Setting default themes' `*.css` file URLs here instead of directly in
	// `./utility/settingsDefaults.js` because those `*.css` files' URLs
	// can only be obtained when running a Webpack build and they wouldn't work
	// when running console tests.
	setDefaultThemes(getDefaultThemes())

	const userData = getUserData()
	const userSettings = getUserSettings()

	// Read user's authentication info from `userData`.
	setInitialAuthState({ dispatch, dataSource, userData })

	// Listen to `userData` changes coming from other browser tabs.
	addUserDataExternalChangeListener({
		dispatch,
		userData
	})

	userData.start()

	// Get settings object.
	const initialSettings = getSettings({ userSettings })

	// Migrate the setings object if required.
	// User settings in local storage will be migrated separately.
	// This migration is just to correctly apply the settings in the `applySettings()` call below.
	// The settings data in local storage won't be affected.
	if (settingsDataRequiresMigration(initialSettings)) {
		migrateSettingsData(initialSettings)
	}

	// Apply user settings.
	applySettings({ dispatch, settings: initialSettings })

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