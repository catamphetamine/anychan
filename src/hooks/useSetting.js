import { useSelector as useSelectorDefault } from 'react-redux'

import { getDefaultSettings } from '../utility/settings/settingsDefaults.js'

export default function useSetting(getter, { useSelector = useSelectorDefault } = {}) {
	// `state.settings.settings` will be `undefined` if there was an error while loading settings.
	return useSelector(state => state.settings.settings ? getter(state.settings.settings) : getter(getDefaultSettings()))
}