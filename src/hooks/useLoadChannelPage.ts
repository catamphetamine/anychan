import type { Dispatch } from 'redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { State, UserData, UserSettings, UserSettingsJson, DataSource } from '../types/index.js'

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
import useOriginalDomainDefault from '../hooks/useOriginalDomain.js'

interface UseLoadChannelPageParameters {
	useCallback?: Function;
	useSelector?: TypedUseSelectorHook<State>;
	useDispatch?: () => Dispatch;
	useUserData?: () => UserData;
	useUserSettings?: () => UserSettings;
	useDataSource?: () => DataSource;
	useOriginalDomain?: () => string;
	wasCancelled?: () => boolean;
}

// Returns a function that loads a channel page.
export default function useLoadChannelPage(parameters: UseLoadChannelPageParameters = {}) {
	const {
		useCallback = useCallbackDefault,
		useSelector = useSelectorDefault<State>,
		useDispatch = useDispatchDefault,
		useUserData = useUserDataDefault,
		useUserSettings = useUserSettingsDefault,
		useDataSource = useDataSourceDefault,
		useOriginalDomain = useOriginalDomainDefault,
		wasCancelled = wasCancelledDefault
	} = parameters

	// `channels` is a just list of "top" channels and is not a complete list of channels.
	const channels = useSelector(state => state.channels.channels)

	const useSetting = (getter: (settings: UserSettingsJson) => unknown) => useSettingCustomizable(getter, { useSelector })

	const censoredWords = useSetting(settings => settings.censoredWords)
	const grammarCorrection = useSetting(settings => settings.grammarCorrection)
	const locale = useSetting(settings => settings.locale)

	const channelLayoutDefault = useSetting(settings => settings.channelLayout)
	const channelSortingDefault = useSetting(settings => settings.channelSorting)

	const dispatch = useDispatch()

	const dataSource = useDataSource()
	const userData = useUserData()
	const userSettings = useUserSettings()
	const originalDomain = useOriginalDomain()

	return useCallback(async (parameters: {
		channel?: {
			id: string,
			title: string
		},
		channelId: string,
		channelLayout?: string,
		channelSorting?: string
	}) => {
		const {
			channel,
			channelId,
			channelLayout: channelLayoutCustom,
			channelSorting: channelSortingCustom
		} = parameters

		const channelLayout = 'channelLayout' in parameters ? channelLayoutCustom : channelLayoutDefault
		const channelSorting = 'channelSorting' in parameters ? channelSortingCustom : channelSortingDefault

		await loadChannelPage({
			channels,
			channel,
			channelId,
			dispatch,
			censoredWords,
			grammarCorrection,
			locale,
			originalDomain,
			userData,
			userSettings,
			dataSource,
			channelLayout,
			channelSorting,
			wasCancelled
		})
	}, [
		channels,
		dispatch,
		censoredWords,
		grammarCorrection,
		locale,
		originalDomain,
		userData,
		userSettings,
		dataSource,
		channelLayoutDefault,
		channelSortingDefault,
		wasCancelled
	])
}

const wasCancelledDefault = () => false