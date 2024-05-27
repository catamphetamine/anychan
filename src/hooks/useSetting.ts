import type { TypedUseSelectorHook } from 'react-redux'
import type { UserSettingsJson, State } from '../types/index.js'

import { useSelector as useSelectorDefault } from 'react-redux'

import { getDefaultSettings } from '../utility/settings/settingsDefaults.js'

interface RootState {
	settings: {
		settings: UserSettingsJson
	}
}

export default function useSetting(getter: (settings: UserSettingsJson) => any, { useSelector = useSelectorDefault }: { useSelector?: TypedUseSelectorHook<State> } = {}) {
	// `state.settings.settings` will be `undefined` if there was an error while loading settings.
	return useSelector(state => state.settings.settings ? getter(state.settings.settings) : getter(getDefaultSettings()))
}