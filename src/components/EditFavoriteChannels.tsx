import type { Channel as ChannelType, FavoriteChannel } from '@/types'

import React, { useState, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

// @ts-expect-error
import { Autocomplete } from 'react-responsive-ui'
// @ts-expect-error
import SortableList from 'react-sortable-dnd-list'

import { isKeyCombination } from 'web-browser-input'
import classNames from 'classnames'

import ListButton from './ListButton.js'
import ChannelUrl from './ChannelUrl.js'

import { channel } from '../PropTypes.js'

import useMessages from '../hooks/useMessages.js'
import useUserData from '../hooks/useUserData.js'
import useSettings from '../hooks/useSettings.js'
import useSelector from '../hooks/useSelector.js'
import useUpdateSetting from '../hooks/useUpdateSetting.js'

import {
	removeFavoriteChannel,
	addFavoriteChannel,
	setFavoriteChannels
} from '../redux/favoriteChannels.js'

import SearchIcon from 'frontend-lib/icons/fill-and-outline/search-outline.svg'

import './EditFavoriteChannels.css'

export default function EditFavoriteChannels({
	onExitEditMode
}: EditFavoriteChannelsProps) {
	const favoriteChannels = useSelector(state => state.favoriteChannels.favoriteChannels)
	const allChannels = useSelector(state => state.channels.allChannels && state.channels.allChannels.channels)

	const messages = useMessages()
	const userData = useUserData()
	const userSettings = useSettings()
	const dispatch = useDispatch()

	const [selectedChannel, setSelectedChannel] = useState<ChannelType | {}>()

	const onInputKeyDown = useCallback((event: KeyboardEvent) => {
		if (isKeyCombination(event, ['Esc']) || isKeyCombination(event, ['Enter'])) {
			event.preventDefault()
			onExitEditMode()
		}
	}, [])

	const onSelectChannel = useCallback((channel: ChannelType) => {
		if (!channel) {
			return onExitEditMode()
		}
		// Set a new "selected channel" with empty `value` and `label`
		// so that the input field is empty again.
		setSelectedChannel({})
		// Add the channel to the list of "favorite channels".
		dispatch(addFavoriteChannel({
			channel: {
				id: channel.id,
				title: channel.title
			},
			userData
		}))
	}, [dispatch, userData])

	const itemComponentProps = useMemo(() => ({
		messages,
		dispatch,
		userData,
		userSettings
	}), [
		messages,
		dispatch,
		userData,
		userSettings
	])

	const onFavoriteChannelsOrderChange = useCallback((favoriteChannels: FavoriteChannel[]) => {
		dispatch(setFavoriteChannels({
			channels: favoriteChannels,
			userData
		}))
	}, [dispatch, userData])

	return (
		<section className="EditFavoriteChannels">
			<Autocomplete
				autoFocus
				autoComplete="off"
				maxOptions={50}
				optionComponent={ChannelOptionComponent}
				icon={SearchIcon}
				placeholder={messages.search}
				className="EditFavoriteChannels-search"
				value={selectedChannel}
				onChange={onSelectChannel}
				onKeyDown={onInputKeyDown}
				options={allChannels
					.filter(_ => !favoriteChannels.find(channel => channel.id === _.id))
					.map((channel) => ({
						value: channel,
						// `channel.title` can be `undefined` on some `8ch.net` userchannels.
						label: `/${channel.id}/ ${channel.title || ''}`
					}))}
			/>
			<SortableList
				component="div"
				className="EditFavoriteChannels-list"
				value={favoriteChannels}
				onChange={onFavoriteChannelsOrderChange}
				itemComponent={Channel}
				itemComponentProps={itemComponentProps}
			/>
		</section>
	)
}

EditFavoriteChannels.propTypes = {
	onExitEditMode: PropTypes.func.isRequired
}

interface EditFavoriteChannelsProps {
	onExitEditMode: () => void
}

function Channel({
	children: channel,
	style,
	dragging,
	dragged
}: ChannelProps) {
	const messages = useMessages()
	const userData = useUserData()
	const dispatch = useDispatch()
	const updateSetting = useUpdateSetting()

	const onRemoveFavoriteChannel = useCallback(async () => {
		await dispatch(removeFavoriteChannel({ channel, userData }))
		// Don't auto-add visited channels to the list of "favorite" channels
		// once the user has deleted a single channel from this "auto" list.
		updateSetting('autoSuggestFavoriteChannels', false)
	}, [
		dispatch,
		channel,
		userData,
		updateSetting
	])

	return (
		<div style={style} className={classNames('EditFavoriteChannels-channel', {
			'EditFavoriteChannels-channel--dragging': dragging,
			'EditFavoriteChannels-channel--dragged': dragged
		})}>
			<ChannelUrl channelId={channel.id} active={dragged}/>
			<span className="EditFavoriteChannels-channelTitle">
				{channel.title || ''}
			</span>
			<ListButton
				muted
				icon="remove"
				onClick={onRemoveFavoriteChannel}
				title={messages.actions.remove}
				className="EditFavoriteChannels-remove"/>
		</div>
	)
}

Channel.propTypes = {
	children: channel.isRequired,
	style: PropTypes.object,
	dragging: PropTypes.bool,
	dragged: PropTypes.bool
}

interface ChannelProps {
	children: ChannelType,
	style: React.CSSProperties,
	dragging?: boolean,
	dragged?: boolean
}

function ChannelOptionComponent({
	value,
	label,
	selected,
	focused
}: ChannelOptionComponentProps) {
	return (
		<span className="EditFavoriteChannels-searchOption">
			<ChannelUrl channelId={value.id}/>
			<span className="rrui__text-line">
				{value.title}
			</span>
		</span>
	)
}

ChannelOptionComponent.propTypes = {
	value: PropTypes.shape({
		id: PropTypes.string.isRequired,
		title: PropTypes.string
	}).isRequired,
	label: PropTypes.string.isRequired,
	selected: PropTypes.bool,
	focused: PropTypes.bool
}

interface ChannelOptionComponentProps {
	value: ChannelType,
	label: string,
	selected?: boolean,
	focused?: boolean
}