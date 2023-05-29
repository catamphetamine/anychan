import { useState, useEffect, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { setChannelLayout, setChannelSorting } from '../../redux/channel.js'
import { saveChannelLayout, saveChannelSorting } from '../../redux/settings.js'

import useUserData from '../../hooks/useUserData.js'
import useSetting from '../../hooks/useSetting.js'
import useSettings from '../../hooks/useSettings.js'
import useDataSource from '../../hooks/useDataSource.js'

import loadChannelPage from '../../pages/Channel/Channel.load.js'

export default function useChannelView({
	channel,
	onChannelViewWillChange,
	onChannelViewDidChange
}) {
	const censoredWords = useSetting(settings => settings.censoredWords)
	const grammarCorrection = useSetting(settings => settings.grammarCorrection)
	const locale = useSetting(settings => settings.locale)
	const autoSuggestFavoriteChannels = useSetting(settings => settings.autoSuggestFavoriteChannels)

	// Cancel any potential running `loadChannelPage()` function
	// when navigating away from this page.
	const wasUnmounted = useRef()
	useEffect(() => {
		// This line is required in React "strict mode" because it runs hooks twice on mount.
		wasUnmounted.current = false
		return () => {
			wasUnmounted.current = true
		}
	}, [])

	const dispatch = useDispatch()
	const userData = useUserData()
	const userSettings = useSettings()
	const dataSource = useDataSource()

	// Added `isSettingChannelView` flag to disable channel view selection buttons
	// in Toolbar while it's loading.
	const [isSettingChannelView, setSettingChannelView] = useState()

	const onSetChannelView = useCallback(async ({ layout, sorting }) => {
		const wasCancelled = () => wasUnmounted.current

		try {
			if (onChannelViewWillChange) {
				onChannelViewWillChange()
			}

			setSettingChannelView(true)

			// Refresh the page.
			await loadChannelPage({
				channelId: channel.id,
				useChannel: () => channel,
				dispatch,
				userData,
				userSettings,
				dataSource,
				wasCancelled,
				censoredWords,
				grammarCorrection,
				locale,
				autoSuggestFavoriteChannels,
				channelLayout: layout,
				channelSorting: sorting
			})

			if (wasCancelled()) {
				return
			}

			// Set `channelLayout` on this particular page.
			dispatch(setChannelLayout(layout))

			// Set `channelSorting` on this particular page.
			dispatch(setChannelSorting(sorting))

			// Save `channelLayout` in user's settings.
			dispatch(saveChannelLayout({ channelLayout: layout, userSettings }))

			// Save `channelSorting` in user's settings.
			dispatch(saveChannelSorting({ channelSorting: sorting, userSettings }))

			if (onChannelViewDidChange) {
				onChannelViewDidChange()
			}
		} finally {
			setSettingChannelView(false)
		}
	}, [
		dispatch,
		userData,
		userSettings,
		channel,
		censoredWords,
		grammarCorrection,
		locale,
		autoSuggestFavoriteChannels
	])

	return {
		isSettingChannelView,
		setChannelView: onSetChannelView
	}
}