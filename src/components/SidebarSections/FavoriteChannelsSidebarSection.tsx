import React, { useState, useCallback, useRef, useMemo } from 'react'
import { useDispatch } from 'react-redux'

import FavoriteChannels from '../FavoriteChannels.js'
import SidebarSection from '../Sidebar/SidebarSection.js'
import EditFavoriteChannels from '../EditFavoriteChannels.js'
import GoToChannelModal from '../GoToChannelModal.js'

import useSelector from '../../hooks/useSelector.js'
import useLocale from '../../hooks/useLocale.js'
import useMessages from '../../hooks/useMessages.js'
import useSetting from '../../hooks/useSetting.js'
import useSettings from '../../hooks/useSettings.js'
import useDataSource from '../../hooks/useDataSource.js'
import useMultiDataSource from '../../hooks/useMultiDataSource.js'
import useOriginalDomain from '@/hooks/useOriginalDomain.js'

import { setChannelsResult } from '../../redux/channels.js'
import getChannels from '../../api/cached/getChannels.js'

import SearchIcon from 'frontend-lib/icons/search.svg'

export default function FavoriteChannelsSidebarSection() {
	const dispatch = useDispatch()
	const messages = useMessages()
	const locale = useLocale()
	const originalDomain = useOriginalDomain()
	const userSettings = useSettings()
	const dataSource = useDataSource()
	const multiDataSource = useMultiDataSource()

	const moreButtonRef = useRef<HTMLButtonElement>()

	const autoSuggestFavoriteChannels = useSetting(settings => settings.autoSuggestFavoriteChannels)
	const favoriteChannels = useSelector(state => state.favoriteChannels.favoriteChannels)
	const allChannels = useSelector(state => state.channels.allChannels && state.channels.allChannels.channels)

	const [editingFavoriteChannels, setEditingFavoriteChannels] = useState<boolean>()

	const [showGoToChannelModal, setShowGoToChannelModal] = useState<boolean>()

	const onHideGoToChannelModal = useCallback(() => {
		setShowGoToChannelModal(false)
	}, [setShowGoToChannelModal])

	const actions = useMemo(() => [
		{
			title: messages.search,
			onClick: () => {
				setShowGoToChannelModal(true);
			},
			Icon: SearchIcon
		}
	], [])

	// Not using `async` here to prevent the focus
	// from being lost on unpush.
	const onMore = useCallback(async (isEditMode: boolean) => {
		const finish = () => setEditingFavoriteChannels(isEditMode)
		if (isEditMode && !allChannels) {
			const channelsResult = await getChannels({
				all: true,
				userSettings,
				dataSource,
				multiDataSource,
				originalDomain,
				locale
			})
			dispatch(setChannelsResult(channelsResult))
			finish()
		} else {
			finish()
		}
	}, [
		dispatch,
		userSettings,
		allChannels,
		dataSource,
		multiDataSource,
		messages,
		locale,
		originalDomain
	])

	let children
	if (editingFavoriteChannels) {
		children = (
			<EditFavoriteChannels
				onExitEditMode={() => {
					moreButtonRef.current.focus()
					moreButtonRef.current.click()
				}}
			/>
		)
	} else {
		if (favoriteChannels.length === 0) {
			// If a user has disabled "auto-suggest favorite channels" feature,
			// then, if the "Favorite Channels" section simply wouldn't be rendered,
			// they wouldn't have any way of adding new "Favorite Channels" after
			// they've previously cleared the list.
			// Therefore, only "don't render anything" if `autoSuggestFavoriteChannels`
			// flag is at the default behavior ("on").
			if (autoSuggestFavoriteChannels === false) {
				children = (
					<div className="SidebarSection-text SidebarSection-text--alternative">
						—
					</div>
				)
			}
		} else {
			children = (
				<FavoriteChannels/>
			)
		}
	}

	if (children) {
		return (
			<SidebarSection
				title={messages.boards.title}
				actions={actions}
				moreLabel={messages.actions.edit}
				moreButtonRef={moreButtonRef}
				onMore={onMore}>
				{children}
				<GoToChannelModal
					isOpen={showGoToChannelModal}
					close={onHideGoToChannelModal}
				/>
			</SidebarSection>
		)
	}

	return null
}

FavoriteChannelsSidebarSection.propTypes = {
	// channel: channel.isRequired,
	// dispatch: PropTypes.func.isRequired
}