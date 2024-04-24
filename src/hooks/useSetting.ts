import type { TypedUseSelectorHook } from 'react-redux';

import { useSelector as useSelectorDefault } from 'react-redux'

import { getDefaultSettings } from '../utility/settings/settingsDefaults.js'

export default function useSetting(getter: (state: object) => unknown, { useSelector = useSelectorDefault }: { useSelector?: TypedUseSelectorHook<any> } = {}) {
	// `state.settings.settings` will be `undefined` if there was an error while loading settings.
	return useSelector(state => state.settings.settings ? getter(state.settings.settings) : getter(getDefaultSettings()))
}