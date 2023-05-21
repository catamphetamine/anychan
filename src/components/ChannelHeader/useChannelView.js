import { useState, useEffect, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { setChannelView } from '../../redux/channel.js'
import { saveChannelView } from '../../redux/settings.js'

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
	const settings = useSetting(settings => settings)

	// Cancel any potential running `loadChannelPage()` function
	// when navigating away from this page.
	const wasUnmounted = useRef()
	useEffect(() => {
		return () => {
			wasUnmounted.current = true
		}
	}, [])

	const dispatch = useDispatch()
	const userData = useUserData()
	const userSettings = useSettings()
	const dataSource = useDataSource()

	// Added `isSettingChannelView` flag to disable Toolbar channel view selection buttons
	// while it's loading.
	const [isSettingChannelView, setSettingChannelView] = useState()

	const onSetChannelView = useCallback(async (view) => {
		const wasCancelled = () => wasUnmounted.current

		try {
			if (onChannelViewWillChange) {
				onChannelViewWillChange(view)
			}

			setSettingChannelView(true)

			// Refresh the page.
			await loadChannelPage({
				channelId: channel.id,
				dispatch,
				userData,
				userSettings,
				dataSource,
				getCurrentChannel: () => channel,
				settings,
				channelView: view,
				wasCancelled
			})

			if (wasCancelled()) {
				return
			}

			// Set `channelView` on this particular page.
			dispatch(setChannelView(view))

			// Save `channelView` in user's settings.
			dispatch(saveChannelView({ channelView: view, userSettings }))

			if (onChannelViewDidChange) {
				onChannelViewDidChange(view)
			}
		} finally {
			setSettingChannelView(false)
		}
	}, [
		dispatch,
		userData,
		userSettings,
		channel,
		settings
	])

	return {
		isSettingChannelView,
		setChannelView: onSetChannelView
	}
}