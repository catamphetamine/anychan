import { ReduxModule } from 'react-website'

import { getDefaultSettings } from '../utility/settings'

const redux = new ReduxModule()

export const getSettings = redux.action
(
	() => async () => localStorage.settings ? JSON.parse(localStorage.settings) : getDefaultSettings(),
	'settings'
)

export const saveSettings = redux.action
(
	(settings) => async () => localStorage.settings = JSON.stringify(settings)
)

export default redux.reducer()