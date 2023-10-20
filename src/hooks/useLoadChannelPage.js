import { useCallback as useCallbackDefault } from 'react'

import {
	useSelector as useSelectorDefault,
	useDispatch as useDispatchDefault
} from 'react-redux'

import loadChannelPage from '../pages/Channel/Channel.load.js'

import useSettingCustomizable from '../hooks/useSetting.js'

import useDataSourceDefault from '../hooks/useDataSource.js'
import useUserSettingsDefault from '../hooks/useSettings.js'
import useUserDataDefault from '../hooks/useUserData.js'

export default function useLoadChannelPage(parameters = {}) {
	const {
		useCallback = useCallbackDefault,
		useSelector = useSelectorDefault,
		useDispatch = useDispatchDefault,
		useUserData = useUserDataDefault,
		useUserSettings = useUserSettingsDefault,
		useDataSource = useDataSourceDefault,
		wasCancelled = wasCancelledDefault
	} = parameters

	const useSetting = (getter) => useSettingCustomizable(getter, { useSelector })

	const censoredWords = useSetting(settings => settings.censoredWords)
	const grammarCorrection = useSetting(settings => settings.grammarCorrection)
	const locale = useSetting(settings => settings.locale)
	const autoSuggestFavoriteChannels = useSetting(settings => settings.autoSuggestFavoriteChannels)

	const channelLayoutDefault = useSetting(settings => settings.channelLayout)
	const channelSortingDefault = useSetting(settings => settings.channelSorting)

	const dispatch = useDispatch()

	const dataSource = useDataSource()
	const userData = useUserData()
	const userSettings = useUserSettings()

	const state = useSelector(state => state.data)

	return useCallback(async (parameters) => {
		const {
			channelId,
			channelLayout: channelLayoutCustom,
			channelSorting: channelSortingCustom
		} = parameters

		const channelLayout = 'channelLayout' in parameters ? channelLayoutCustom : channelLayoutDefault
		const channelSorting = 'channelSorting' in parameters ? channelSortingCustom : channelSortingDefault

		return await loadChannelPage({
			channelId,
			state,
			dispatch,
			censoredWords,
			grammarCorrection,
			locale,
			userData,
			userSettings,
			dataSource,
			autoSuggestFavoriteChannels,
			channelLayout,
			channelSorting,
			wasCancelled
		})
	}, [
		state,
		dispatch,
		censoredWords,
		grammarCorrection,
		locale,
		userData,
		userSettings,
		dataSource,
		autoSuggestFavoriteChannels,
		channelLayoutDefault,
		channelSortingDefault,
		wasCancelled
	])
}

const wasCancelledDefault = () => false