import { useState, useEffect, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { setChannelLayout, setChannelSorting } from '../../redux/channel.js'
import { saveChannelLayout, saveChannelSorting } from '../../redux/settings.js'

import useUserData from '../../hooks/useUserData.js'
import useSetting from '../../hooks/useSetting.js'
import useSettings from '../../hooks/useSettings.js'
import useDataSource from '../../hooks/useDataSource.js'
import useLoadChannelPage from '../../hooks/useLoadChannelPage.js'

export default function useChannelView({
	onChannelViewWillChange,
	onChannelViewDidChange
}) {
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

	const wasCancelled = useCallback(() => wasUnmounted.current, [])

	const loadChannelPage = useLoadChannelPage({
		wasCancelled
	})

	const dispatch = useDispatch()
	const userSettings = useSettings()

	// Added `isSettingChannelView` flag to disable channel view selection buttons
	// in Toolbar while it's loading.
	const [isSettingChannelView, setSettingChannelView] = useState()

	const channel = useSelector(state => state.data.channel)

	const onSetChannelView = useCallback(async ({ layout, sorting }) => {
		try {
			if (onChannelViewWillChange) {
				onChannelViewWillChange()
			}

			setSettingChannelView(true)

			// Refresh the page.
			await loadChannelPage({
				channelId: channel.id,
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
		userSettings,
		channel,
		loadChannelPage
	])

	return {
		isSettingChannelView,
		setChannelView: onSetChannelView
	}
}