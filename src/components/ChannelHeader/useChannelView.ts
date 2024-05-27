import type { Channel, ChannelSorting, ChannelLayout } from '@/types'

import { useState, useEffect, useRef, useCallback } from 'react'
import {  useDispatch } from 'react-redux'

import { setChannelLayout, setChannelSorting } from '../../redux/channelPage.js'
import { setShowPageLoadingIndicator } from '../../redux/app.js'

import useUpdateSetting from '../../hooks/useUpdateSetting.js'
import useLoadChannelPage from '../../hooks/useLoadChannelPage.js'

export default function useChannelView({
	channel,
	onChannelViewWillChange,
	onChannelViewDidChange
}: {
	channel: Channel,
	onChannelViewWillChange: () => void,
	onChannelViewDidChange: () => void
}) {
	// Cancel any potential running `loadChannelPage()` function
	// when navigating away from this page.
	const wasUnmounted = useRef<boolean>()
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
	const updateSetting = useUpdateSetting()

	// Added `isSettingChannelView` flag to disable channel view selection buttons
	// in Toolbar while it's loading.
	const [isSettingChannelView, setSettingChannelView] = useState<boolean>()

	const onSetChannelView = useCallback(async ({
		layout,
		sorting
	}: {
		layout: ChannelLayout,
		sorting: ChannelSorting
	}) => {
		try {
			if (onChannelViewWillChange) {
				onChannelViewWillChange()
			}

			setSettingChannelView(true)
			dispatch(setShowPageLoadingIndicator(true))

			// Refresh the page.
			await loadChannelPage({
				channel,
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

			// Save `channelLayout` and `channelSorting` in user's settings.
			updateSetting('channelLayout', layout);
			updateSetting('channelSorting', sorting);

			if (onChannelViewDidChange) {
				onChannelViewDidChange()
			}
		} finally {
			setSettingChannelView(false)
			dispatch(setShowPageLoadingIndicator(false))
		}
	}, [
		dispatch,
		channel,
		loadChannelPage
	])

	return {
		isSettingChannelView,
		setChannelView: onSetChannelView
	}
}