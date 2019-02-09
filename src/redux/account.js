import { ReduxModule } from 'react-website'

import { getDefaultSettings } from '../utility/settings'

const redux = new ReduxModule()

export const getSettings = redux.action(
	() => async () => {
		return {
			...getDefaultSettings(),
			...getCustomSettings()
		}
	},
	'settings'
)

// export const saveSettings = redux.action(
// 	(settings) => async () => localStorage.settings = JSON.stringify(settings)
// )

export const saveLocale = redux.action(
	(locale) => async () => {
		const settings = getCustomSettings()
		settings.locale = locale
		localStorage.settings = JSON.stringify(settings)
		return {
			...getDefaultSettings(),
			...settings
		}
	},
	'settings'
)

export default redux.reducer()

function getCustomSettings() {
	let settings = {}
	if (localStorage.settings) {
		try {
			settings = JSON.parse(localStorage.settings)
		} catch (error) {
			if (error instanceof SyntaxError) {
				console.error(`Invalid settings JSON:\n\n${localStorage.settings}`)
			} else {
				throw error
			}
		}
	}
	return settings
}