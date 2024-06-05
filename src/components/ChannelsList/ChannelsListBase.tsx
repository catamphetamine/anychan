import type { Channel, ChannelsListView } from '@/types'

import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-pages'
import { useDispatch } from 'react-redux'
import classNames from 'classnames'

// @ts-expect-error
import { Button } from 'react-responsive-ui'

import { setChannels } from '../../redux/channels.js'

import getTopChannelsCached from '@/api/cached/getTopChannels.js'

import {
	useMessages,
	useSettings,
	useDataSource,
	useMultiDataSource,
	useSetting,
	useUpdateSetting,
	useOriginalDomain
} from '@/hooks'

import ChannelsListViewSwitcher from './ChannelsListViewSwitcher.js'

import { channelShape } from './ChannelsList.propTypes.js'

import './ChannelsListBase.css'

// `<Channels/>` are used in `pages/Channels.js`.
export default function ChannelsListBase({
	views,
	channels,
	channelsSortedByPopularity,
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
	const originalDomain = useOriginalDomain()

	const locale = useSetting(settings => settings.locale)

	const [filteredChannels, setFilteredChannels] = useState<Channel[]>()
	const [view, setView] = useState<ChannelsListView>()

	const defaultChannelsView = getChannelsView(channelsViewSetting, {
		canViewByCategory: Boolean(channelsByCategory) && (views && views.includes('by-category')),
		canViewSortedByPopularity: Boolean(channelsSortedByPopularity)
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
				return (filteredChannels || channelsSortedByPopularity || channels)
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
		channelsSortedByPopularity,
		channelsByCategory,
		filteredChannels,
		isChannelSelected,
		showAllChannels
	])

	const loadChannelsList = useCallback(async () => {
		const { channels } = await getTopChannelsCached({
			userSettings,
			dataSource,
			multiDataSource,
			originalDomain,
			locale
		})
		dispatch(setChannels({
			channels,
			dataSource
		}))
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
			{views && (views.includes('list') && channelsSortedByPopularity) && (channelsByCategory && views.includes('by-category')) &&
				<ChannelsListViewSwitcher
					view={channelsView}
					onViewChange={onViewChange}
				/>
			}

			<ListComponent
				items={getChannelsListItems()}
				className={classNames('Channels-list', {
					// 'Channels-list--list': channelsView === 'list',
					'Channels-list--by-category': channelsView === 'by-category'
				})}
			/>
		</nav>
	)
}

ChannelsListBase.propTypes = {
	views: PropTypes.arrayOf(PropTypes.oneOf(['list', 'by-category'])),
	channels: PropTypes.arrayOf(PropTypes.shape(channelShape)),
	channelsSortedByPopularity: PropTypes.arrayOf(PropTypes.shape(channelShape)),
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
	channelsSortedByPopularity?: Channel[],
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
	canViewSortedByPopularity
}: {
	canViewByCategory: boolean
	canViewSortedByPopularity: boolean
}) {
	switch (channelsView) {
		case 'by-category':
			if (canViewByCategory) {
				return channelsView
			}
		case 'list':
			return channelsView
	}
	if (canViewSortedByPopularity) {
		return 'list'
	}
	if (canViewByCategory) {
		return 'by-category'
	}
	return 'list'
}