import type { Channel, ChannelsListView } from '@/types'

import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-pages'
import { useDispatch } from 'react-redux'
import classNames from 'classnames'

// @ts-expect-error
import { Button } from 'react-responsive-ui'

import { refreshSettings } from '../../redux/settings.js'
import { setChannelsResult } from '../../redux/channels.js'

import getChannelsCached from '@/api/cached/getChannels.js'

import useMessages from '../../hooks/useMessages.js'
import useSettings from '../../hooks/useSettings.js'
import useDataSource from '../../hooks/useDataSource.js'
import useMultiDataSource from '../../hooks/useMultiDataSource.js'
import useSetting from '../../hooks/useSetting.js'
import useUpdateSetting from '../../hooks/useUpdateSetting.js'

import ChannelsListSearch from './ChannelsListSearch.js'
import ChannelsListViewSwitcher from './ChannelsListViewSwitcher.js'

import { channelShape } from './ChannelsList.propTypes.js'

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
	hasMoreChannels
}: ChannelsListBaseProps) {
	const dispatch = useDispatch()
	const messages = useMessages()
	const userSettings = useSettings()
	const updateSetting = useUpdateSetting()
	const dataSource = useDataSource()
	const multiDataSource = useMultiDataSource()

	const locale = useSetting(settings => settings.locale)

	const [filteredChannels, setFilteredChannels] = useState<Channel[]>()
	const [view, setView] = useState<ChannelsListView>()

	const defaultChannelsView = getChannelsView(channelsViewSetting, {
		canViewByCategory: Boolean(channelsByCategory) && (views && views.includes('by-category')),
		canViewByPopularity: Boolean(channelsByPopularity)
	})

	const channelsView = view || defaultChannelsView

	const onViewChange = useCallback((view: ChannelsListView) => {
		setView(view)
		if (shouldSaveChannelsView) {
			updateSetting('channelsView', view)
		}
	}, [
		shouldSaveChannelsView,
		updateSetting
	])

	const isChannelSelected = useCallback((channel: Channel) => {
		return highlightSelectedChannel && selectedChannel && channel.id === selectedChannel.id
	}, [
		highlightSelectedChannel,
		selectedChannel
	])

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
					.filter(channel => showAllChannels || !channel.hidden)
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
		const channelsResult = await getChannelsCached({
			userSettings,
			dataSource,
			multiDataSource,
			locale
		})
		setChannelsResult(channelsResult)
	}, [
		dispatch,
		userSettings,
		dataSource,
		multiDataSource,
		locale
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
				items={getChannelsListItems()}
				className={classNames('Channels-list', {
					// 'Channels-list--list': channelsView === 'list',
					'Channels-list--by-category': channelsView === 'by-category'
				})}/>

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

ChannelsListBase.propTypes = {
	views: PropTypes.arrayOf(PropTypes.oneOf(['list', 'by-category'])),
	channels: PropTypes.arrayOf(PropTypes.shape(channelShape)),
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

interface ChannelsListBaseProps {
	views?: ChannelsListView[],
	channels?: Channel[],
	channelsByPopularity?: Channel[],
	channelsByCategory?: { category: string, channels: Channel[] }[],
	channelsView?: ChannelsListView,
	shouldSaveChannelsView?: boolean,
	showAllChannels?: boolean,
	showAllChannelsLink?: boolean,
	listComponent: React.ElementType,
	selectedChannel?: Channel
	highlightSelectedChannel?: boolean,
	hasMoreChannels?: boolean
}

function getChannelsView(channelsView: ChannelsListView, {
	canViewByCategory,
	canViewByPopularity
}: {
	canViewByCategory: boolean
	canViewByPopularity: boolean
}) {
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