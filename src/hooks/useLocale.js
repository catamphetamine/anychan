import { useSelector as useSelectorDefault } from 'react-redux'

import { getDefaultLanguage } from '../utility/settings/settingsDefaults.js'

export default function useLocale({ useSelector = useSelectorDefault } = {}) {
	// `state.settings.settings` will be `undefined` if there was an error while loading settings.
	return useSelector(state => state.settings.settings ? state.settings.settings.locale : getDefaultLanguage())

	// Or simply:
	// import useSetting from '../../hooks/useSetting.js'
	// return useSetting(settings => settings.locale)
}