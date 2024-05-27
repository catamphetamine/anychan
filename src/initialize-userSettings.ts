import type { DataSource } from '@/types'

import createUserSettings from './createUserSettings.js'
import { migrateSettingsData, settingsDataRequiresMigration } from './utility/settings/UserSettings.js'
import { applyDarkModeSettings } from './utility/settings/applySettings.js'
import getSettings from './utility/settings/getSettings.js'

export default async function({
	dataSource,
	multiDataSource
}: {
	dataSource: DataSource,
	multiDataSource: boolean
}) {
	const userSettings = createUserSettings({
		dataSource,
		multiDataSource
	})

	// Get settings object.
	const initialSettings = getSettings({ userSettings })

	// Migrate the setings object if required.
	// User settings in local storage will not be affected and will be migrated separately later.
	// This migration is just to correctly apply the settings in the `applySettings()` call below.
	// The settings data in local storage won't be affected.
	if (settingsDataRequiresMigration(initialSettings)) {
		migrateSettingsData(initialSettings)
	}

	// Apply "visual" settings before rendering the app:
	//
	// * Dark Mode "on"/"off"
	//
	// Why do those "visual" settings have to be applied before rendering the app?
	// Why aren't they just applied in `Application.load()`?
	//
	// The rationale is because those settings influence how the application looks.
	// For example, if the user has enabled Dark Mode and the application only applies
	// that setting some time after the website has loaded, then the user would get
	// a flash of white content because their Dark Mode setting hasn't been applied yet.
	// So the application should apply any visual settings sooner than later,
	// provided that the initial render itself is an asynchronous process:
	// * First, the router "matches" the location URL asynchronously using `Promise`s.
	// * Then, after it has "matched" the route, it starts `load()`ing the page.
	//
	// With such trick in place, could the user still get a flash of white content in Dark Mode?
	// Since this script is included on a page via `<script src="..." defer/>`,
	// I guess the web browser will start executing it right after it has finished
	// parsing the HTML document, so I guess one could assume that this script
	// will be executed "synchronously", or in other words "before the initial render of the page",
	// in which case there won't be a flash of white content for a Dark Mode user.
	//
	applyDarkModeSettings({
		// No need to `dispatch` any actions because there's no Redux store yet.
		// User Settings will be re-applied properly in `Application.load()`.
		dispatch: (action: any) => action,
		settings: initialSettings
	})
}