import type { Theme } from '../types/index.js'

import useSelector from './useSelector.js'

import { getDefaultThemeId } from '../utility/settings/settingsDefaults.js'

export default function useTheme(): Theme['id'] {
	// `state.settings.settings` will be `undefined` if there was an error while loading settings.
	return useSelector(state => state.settings.settings ? state.settings.settings.theme : getDefaultThemeId())

	// Or simply:
	// import useSetting from '../../hooks/useSetting.js'
	// return useSetting(settings => settings.theme)
}