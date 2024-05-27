import type { State } from '@/types'

import { ReduxModule } from 'react-pages'

import getSettings from '../utility/settings/getSettings.js'

const redux = new ReduxModule<State['settings']>()

export const refreshSettings = redux.simpleAction(
	(state, { userSettings }) => ({
		...state,
		settings: getSettings({ userSettings })
	})
)

export const setSettingsFromCustomSettingsData = redux.simpleAction(
	(state, { settings }) => ({
		...state,
		settings: getSettings({ settings })
	})
)

export default redux.reducer()