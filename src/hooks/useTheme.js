import { useSelector } from 'react-redux'

import { getDefaultThemeId } from '../utility/settings/settingsDefaults.js'

export default function useTheme() {
	// `state.settings.settings` will be `undefined` if there was an error while loading settings.
	return useSelector(state => state.settings.settings ? state.settings.settings.theme : getDefaultThemeId())

	// Or simply:
	// import useSetting from '../../hooks/useSetting.js'
	// return useSetting(settings => settings.theme)
}