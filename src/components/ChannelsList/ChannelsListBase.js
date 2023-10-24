import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-pages'
import { useDispatch } from 'react-redux'
import { Button } from 'react-responsive-ui'
import classNames from 'classnames'

import { saveChannelsView } from '../../redux/settings.js'
import { getChannels } from '../../redux/data.js'

import useMessages from '../../hooks/useMessages.js'
import useSettings from '../../hooks/useSettings.js'
import useDataSource from '../../hooks/useDataSource.js'

import ChannelsListSearch from './ChannelsListSearch.js'
import ChannelsListViewSwitcher from './ChannelsListViewSwitcher.js'

import './ChannelsListBase.css'

// `<Channels/>` are used in `pages/Channels.js`.
export default function ChannelsListBase({
	views,
	channels,
	channelsByPopularity,
	channelsByCategory,
	channelsView: channelsViewSetting,
	shouldSaveChannelsView,
	showAllChannels,
	showAllChannelsLink,
	listComponent: ListComponent,
	selectedChannel,
	highlightSelectedChannel,
	hasMoreChannels,
	className
}) {
	const dispatch = useDispatch()
	const messages = useMessages()
	const userSettings = useSettings()
	const dataSource = useDataSource()

	const [filteredChannels, setFilteredChannels] = useState()
	const [view, setView] = useState()

	const defaultChannelsView = getChannelsView(channelsViewSetting, {
		canViewByCategory: Boolean(channelsByCategory) && (views && views.includes('by-category')),
		canViewByPopularity: Boolean(channelsByPopularity)
	})

	const channelsView = view || defaultChannelsView

	const onViewChange = useCallback((view) => {
		setView(view)
		if (shouldSaveChannelsView) {
			dispatch(saveChannelsView({ channelsView: view, userSettings }))
		}
	}, [dispatch])

	const isChannelSelected = useCallback((channel) => {
		return highlightSelectedChannel && selectedChannel && channel.id === selectedChannel.id
	}, [highlightSelectedChannel, selectedChannel])

	const getChannelsListItems = useCallback(() => {
		switch (channelsView) {
			case 'by-category':
				return channelsByCategory.reduce((all, category, i) => {
					return all.concat([{
						key: category.category || '—',
						category: category.category,
						first: i === 0
					}]).concat(category.channels.map((channel) => ({
						key: channel.id,
						channel,
						selected: isChannelSelected(channel)
					})))
				}, [])
			case 'list':
				return (filteredChannels || channelsByPopularity || channels)
					.filter(channel => showAllChannels || !channel.isHidden)
					.map((channel) => ({
						key: channel.id,
						channel,
						selected: isChannelSelected(channel)
					}))
			default:
				// Unsupported `channelsView`.
				return []
			}
	}, [
		channelsView,
		channels,
		channelsByPopularity,
		channelsByCategory,
		filteredChannels,
		isChannelSelected,
		showAllChannels
	])

	const loadChannelsList = useCallback(async () => {
		await dispatch(getChannels({
			userSettings,
			dataSource,
			messages
		}))
	}, [
		dispatch,
		userSettings,
		dataSource,
		messages
	])

	if (!channels) {
		return (
			<p className="Channels-error">
				<span className="Channels-errorText">
					{messages.boards.error}
				</span>
				<br/>
				<Button className="Channels-errorRetry" onClick={loadChannelsList}>
					{messages.actions.retry}
				</Button>
			</p>
		)
	}

	return (
		<nav className="Channels">
			{views && (views.includes('list') && channelsByPopularity) && (channelsByCategory && views.includes('by-category')) &&
				<ChannelsListViewSwitcher
					view={channelsView}
					onViewChange={onViewChange}
				/>
			}

			{showAllChannels && channelsView === 'list' &&
				<ChannelsListSearch
					channels={channels || channelsByPopularity}
					setSearchResults={setFilteredChannels}
				/>
			}

			<ListComponent
				className={classNames('Channels-list', {
					// 'Channels-list--list': channelsView === 'list',
					'Channels-list--by-category': channelsView === 'by-category'
				})}>
				{getChannelsListItems()}
			</ListComponent>

			{!showAllChannels && showAllChannelsLink && (hasMoreChannels || dataSource.contentCategoryUnspecified) &&
				<div className="Channels-showAllWrapper">
					<Link to="/channels" className="Channels-showAll">
						{messages.boards.showAll}
					</Link>
				</div>
			}
		</nav>
	)
}

export const channelShape = {
	id: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	description: PropTypes.string,
	commentsPerHour: PropTypes.number
}

ChannelsListBase.propTypes = {
	views: PropTypes.arrayOf(PropTypes.oneOf(['list', 'by-category'])),
	channels: PropTypes.arrayOf(PropTypes.shape(channelShape)).isRequired,
	channelsByPopularity: PropTypes.arrayOf(PropTypes.shape(channelShape)),
	channelsByCategory: PropTypes.arrayOf(PropTypes.shape({
		category: PropTypes.string.isRequired,
		channels: PropTypes.arrayOf(PropTypes.shape(channelShape)).isRequired
	})),
	channelsView: PropTypes.string,
	shouldSaveChannelsView: PropTypes.bool,
	showAllChannels: PropTypes.bool,
	showAllChannelsLink: PropTypes.bool,
	selectedChannel: PropTypes.shape(channelShape),
	highlightSelectedChannel: PropTypes.bool,
	// isChannelOrThreadLocation: PropTypes.bool,
	hasMoreChannels: PropTypes.bool,
	// dispatch: PropTypes.func,
	listComponent: PropTypes.elementType.isRequired,
	className: PropTypes.string
}

function getChannelsView(channelsView, { canViewByCategory, canViewByPopularity }) {
	switch (channelsView) {
		case 'by-category':
			if (canViewByCategory) {
				return channelsView
			}
		case 'list':
			return channelsView
	}
	if (canViewByPopularity) {
		return 'list'
	}
	if (canViewByCategory) {
		return 'by-category'
	}
	return 'list'
}