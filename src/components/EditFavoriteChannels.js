import React, { useState, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { Autocomplete } from 'react-responsive-ui'
import SortableList from 'react-sortable-dnd-list'
import classNames from 'classnames'

import ListButton from './ListButton'
import ChannelUrl from './ChannelUrl'

import { channel } from '../PropTypes'
import getMessages from '../messages'

import { saveAutoSuggestFavoriteChannels } from '../redux/settings'
import {
	removeFavoriteChannel,
	addFavoriteChannel,
	setFavoriteChannels
} from '../redux/favoriteChannels'

import SearchIcon from 'webapp-frontend/assets/images/icons/menu/search-outline.svg'

import './Channels.css'
import './EditFavoriteChannels.css'

export default function EditFavoriteChannels() {
	const favoriteChannels = useSelector(({ favoriteChannels }) => favoriteChannels.favoriteChannels)
	const allChannels = useSelector(({ data }) => data.allChannels && data.allChannels.channels)
	const locale = useSelector(({ settings }) => settings.settings.locale)
	const dispatch = useDispatch()
	const [selectedChannel, setSelectedChannel] = useState()
	const onSelectChannel = useCallback((channel) => {
		// Set a new "selected channel" with empty `value` and `label`
		// so that the input field is empty again.
		setSelectedChannel({})
		// Add the channel to the list of "favorite channels".
		dispatch(addFavoriteChannel(channel))
	}, [dispatch])
	const itemComponentProps = useMemo(() => ({
		locale,
		dispatch
	}), [locale, dispatch])
	const onFavoriteChannelsOrderChange = useCallback((favoriteChannels) => {
		dispatch(setFavoriteChannels(favoriteChannels))
	}, [dispatch])
	return (
		<section className="EditFavoriteChannels">
			<Autocomplete
				autoFocus
				autoComplete="off"
				maxOptions={50}
				optionComponent={ChannelOptionComponent}
				icon={SearchIcon}
				className="EditFavoriteChannels-search"
				value={selectedChannel}
				onChange={onSelectChannel}
				options={allChannels
					.filter(_ => !favoriteChannels.find(channel => channel.id === _.id))
					.map((channel) => ({
						value: channel,
						// `channel.title` can be `undefined` on some `8ch.net` userchannels.
						label: `/${channel.id}/ ${channel.title || ''}`
					}))}/>
			<SortableList
				component="div"
				className="EditFavoriteChannels-list"
				value={favoriteChannels}
				onChange={onFavoriteChannelsOrderChange}
				itemComponent={Channel}
				itemComponentProps={itemComponentProps}/>
		</section>
	)
}

EditFavoriteChannels.propTypes = {
	// favoriteChannels: PropTypes.arrayOf(channel).isRequired,
	// allChannels: PropTypes.arrayOf(channel).isRequired,
	// locale: PropTypes.string.isRequired,
	// dispatch: PropTypes.func.isRequired
}

function Channel({
	children: channel,
	locale,
	dispatch,
	style,
	dragging,
	dragged
}) {
	const onRemoveFavoriteChannel = useCallback(async () => {
		await dispatch(removeFavoriteChannel(channel))
		// Don't auto-add visited channels to the list of "favorite" channels
		// once the user has deleted a single channel from this "auto" list.
		dispatch(saveAutoSuggestFavoriteChannels(false))
	}, [dispatch, channel])
	return (
		<div style={style} className={classNames('EditFavoriteChannels-channel', {
			'EditFavoriteChannels-channel--dragging': dragging,
			'EditFavoriteChannels-channel--dragged': dragged
		})}>
			<ChannelUrl channelId={channel.id} active={dragged}/>
			<span className="EditFavoriteChannels-channelTitle">
				{channel.title}
			</span>
			<ListButton
				muted
				icon="remove"
				onClick={onRemoveFavoriteChannel}
				title={getMessages(locale).actions.remove}
				className="EditFavoriteChannels-remove"/>
		</div>
	)
}

Channel.propTypes = {
	children: channel.isRequired,
	locale: PropTypes.string.isRequired,
	dispatch: PropTypes.func.isRequired,
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
	value: PropTypes.string,
	label: PropTypes.string.isRequired,
	selected: PropTypes.bool,
	focused: PropTypes.bool
}