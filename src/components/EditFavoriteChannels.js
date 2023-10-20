import React, { useState, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { Autocomplete } from 'react-responsive-ui'
import SortableList from 'react-sortable-dnd-list'
import { isKeyCombination } from 'web-browser-input'
import classNames from 'classnames'

import ListButton from './ListButton.js'
import ChannelUrl from './ChannelUrl.js'

import { channel } from '../PropTypes.js'

import useMessages from '../hooks/useMessages.js'
import useUserData from '../hooks/useUserData.js'
import useSettings from '../hooks/useSettings.js'

import { saveAutoSuggestFavoriteChannels } from '../redux/settings.js'

import {
	removeFavoriteChannel,
	addFavoriteChannel,
	setFavoriteChannels
} from '../redux/favoriteChannels.js'

import SearchIcon from 'frontend-lib/icons/fill-and-outline/search-outline.svg'

import './EditFavoriteChannels.css'

export default function EditFavoriteChannels({
	onExitEditMode
}) {
	const favoriteChannels = useSelector(state => state.favoriteChannels.favoriteChannels)
	const allChannels = useSelector(state => state.data.allChannels && state.data.allChannels.channels)

	const messages = useMessages()
	const userData = useUserData()
	const userSettings = useSettings()
	const dispatch = useDispatch()

	const [selectedChannel, setSelectedChannel] = useState()

	const onInputKeyDown = useCallback((event) => {
		if (isKeyCombination(event, ['Esc']) || isKeyCombination(event, ['Enter'])) {
			event.preventDefault()
			onExitEditMode()
		}
	}, [])

	const onSelectChannel = useCallback((channel) => {
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

	const onFavoriteChannelsOrderChange = useCallback((favoriteChannels) => {
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

function Channel({
	children: channel,
	messages,
	dispatch,
	userData,
	userSettings,
	style,
	dragging,
	dragged
}) {
	const onRemoveFavoriteChannel = useCallback(async () => {
		await dispatch(removeFavoriteChannel({ channel, userData }))
		// Don't auto-add visited channels to the list of "favorite" channels
		// once the user has deleted a single channel from this "auto" list.
		dispatch(saveAutoSuggestFavoriteChannels({
			autoSuggestFavoriteChannels: false,
			userSettings
		}))
	}, [
		dispatch,
		channel
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
	messages: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
	userData: PropTypes.object.isRequired,
	userSettings: PropTypes.object.isRequired,
	style: PropTypes.object
}

function ChannelOptionComponent({
	value,
	label,
	selected,
	focused
}) {
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