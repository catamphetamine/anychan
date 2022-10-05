import React, { useState, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-pages'
import { useSelector, useDispatch } from 'react-redux'
import { TextInput, Button, Select } from 'react-responsive-ui'
import classNames from 'classnames'

import { getProvider } from '../provider.js'
import getUrl from '../utility/getUrl.js'
import isThreadPage from '../utility/routes/isThreadPage.js'
import isChannelPage from '../utility/routes/isChannelPage.js'
import { saveChannelsView } from '../redux/settings.js'
import { getChannels } from '../redux/data.js'

import useMessages from '../hooks/useMessages.js'

import ChannelUrl from './ChannelUrl.js'

import SearchIcon from 'frontend-lib/icons/fill-and-outline/search-outline.svg'

import './Channels.css'

export default function ChannelsInSidebar(props) {
	const favoriteChannels = useSelector(state => state.favoriteChannels.favoriteChannels)

	// Channels won't be loaded in "offline" mode.
	const __channels = useSelector(state => state.data.channels)
	const channels = __channels || []

	const channelsByPopularity = useSelector(state => state.data.channelsByPopularity)
	const channelsByCategory = useSelector(state => state.data.channelsByCategory)
	const hasMoreChannels = useSelector(state => state.data.hasMoreChannels)
	const selectedChannel = useSelector(state => state.data.channel)

	const exceptFavoriteChannels = useCallback((channels) => {
		return channels && channels.filter(channel => !favoriteChannels.find(_ => _.id === channel.id))
	}, [favoriteChannels])

	const _channels = useMemo(() => exceptFavoriteChannels(channels), [channels, exceptFavoriteChannels])
	const _channelsByPopularity = useMemo(() => exceptFavoriteChannels(channelsByPopularity), [channelsByPopularity, exceptFavoriteChannels])
	const _channelsByCategory = useMemo(() => exceptFavoriteChannels(channelsByCategory), [channelsByCategory, exceptFavoriteChannels])

	const channelsView = useSelector(state => state.settings.settings.channelsView)

	return (
		<Channels
			highlightSelectedChannel
			shouldSaveChannelsView
			channels={_channels}
			channelsByPopularity={_channelsByPopularity}
			channelsByCategory={_channelsByCategory}
			hasMoreChannels={hasMoreChannels}
			selectedChannel={selectedChannel}
			channelsView={channelsView}
			{...props}/>
	)
}

export function FavoriteChannels(props) {
	const selectedChannel = useSelector(state => state.data.channel)
	return (
		<Channels
			showAllChannelsLink={false}
			selectedChannel={selectedChannel}
			highlightSelectedChannel
			{...props}/>
	)
}

// `<Channels/>` are used in `pages/Channels.js`.
export function Channels({
	channels,
	channelsByPopularity,
	channelsByCategory,
	channelsView: channelsViewSetting,
	shouldSaveChannelsView,
	showAllChannels,
	showAllChannelsLink,
	listComponent,
	selectedChannel,
	highlightSelectedChannel,
	hasMoreChannels,
	className
}) {
	const dispatch = useDispatch()
	const messages = useMessages()

	const isChannelOrThreadLocation = useSelector(state => {
		return isChannelPage(state.found.resolvedMatch) ||
			isThreadPage(state.found.resolvedMatch)
	})

	const [searchQuery, setSearchQuery] = useState()
	const [filteredChannels, setFilteredChannels] = useState()
	const [view, setView] = useState()

	const defaultChannelsView = getChannelsView(channelsViewSetting, {
		canViewByCategory: channelsByCategory && (listComponent === ChannelsList),
		canViewByPopularity: channelsByPopularity
	})

	const channelsView = view || defaultChannelsView

	const onSetView = useCallback((view) => {
		setView(view)
		if (shouldSaveChannelsView) {
			dispatch(saveChannelsView(view))
		}
	}, [dispatch])

	const onChangeViewAllChannels = useCallback(() => onSetView('list'), [])
	const onChangeViewByCategory = useCallback(() => onSetView('by-category'), [])

	const onSearchQueryChange = useCallback((query) => {
		query = query.toLowerCase()
		setSearchQuery(query)
		setFilteredChannels((channels || channelsByPopularity).filter((channel) => {
			// Some channels on `8ch.net` don't have a name.
			return (channel.title && channel.title.toLowerCase().includes(query)) ||
				channel.id.toLowerCase().includes(query)
		}))
	}, [channels, channelsByPopularity])

	const isChannelSelected = useCallback((channel) => {
		return highlightSelectedChannel &&
			isChannelOrThreadLocation &&
			channel.id === selectedChannel.id
	}, [highlightSelectedChannel, isChannelOrThreadLocation, selectedChannel])

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
		await dispatch(getChannels())
	}, [dispatch])

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

	const List = listComponent

	return (
		<nav className="Channels">
			{channelsByPopularity && (channelsByCategory && List === ChannelsList) &&
				<ChannelsViewSwitcher
					view={channelsView}
					onChangeViewAllChannels={onChangeViewAllChannels}
					onChangeViewByCategory={onChangeViewByCategory}/>
			}

			{showAllChannels && channelsView === 'list' &&
				<TextInput
					type="search"
					autoFocus
					icon={SearchIcon}
					placeholder={messages.search}
					value={searchQuery}
					onChange={onSearchQueryChange}
					className="Channels-search"/>
			}

			{showAllChannels && channelsView === 'list' && searchQuery && filteredChannels.length === 0 &&
				<div className="Channels-nothingFound">
					{messages.noSearchResults}
				</div>
			}

			<List
				className={classNames('Channels-list', {
					'Channels-list--grid': List === ChannelsList,
					// 'Channels-list--list': channelsView === 'list',
					'Channels-list--by-category': channelsView === 'by-category'
				})}>
				{getChannelsListItems()}
			</List>

			{!showAllChannels && showAllChannelsLink && (hasMoreChannels || getProvider().contentCategoryUnspecified) &&
				<div className="Channels-showAllWrapper">
					<Link to="/channels" className="Channels-showAll">
						{messages.boards.showAll}
					</Link>
				</div>
			}
		</nav>
	)
}

const channelShape = {
	id: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	description: PropTypes.string,
	commentsPerHour: PropTypes.number
}

Channels.propTypes = {
	channels: PropTypes.arrayOf(PropTypes.shape(channelShape)).isRequired,
	channelsByPopularity: PropTypes.arrayOf(PropTypes.shape(channelShape)),
	channelsByCategory: PropTypes.arrayOf(PropTypes.shape({
		category: PropTypes.string.isRequired,
		channels: PropTypes.arrayOf(PropTypes.shape(channelShape)).isRequired
	})),
	channelsView: PropTypes.string,
	shouldSaveChannelsView: PropTypes.bool,
	showAllChannels: PropTypes.bool,
	showAllChannelsLink: PropTypes.bool.isRequired,
	selectedChannel: PropTypes.shape(channelShape),
	highlightSelectedChannel: PropTypes.bool,
	// isChannelOrThreadLocation: PropTypes.bool,
	hasMoreChannels: PropTypes.bool,
	// dispatch: PropTypes.func,
	listComponent: PropTypes.elementType.isRequired,
	className: PropTypes.string
}

Channels.defaultProps = {
	listComponent: ChannelsList,
	showAllChannelsLink: true
}

function ChannelsViewSwitcher({
	view,
	onChangeViewAllChannels,
	onChangeViewByCategory
}) {
	const messages = useMessages()

	const options = useMemo(() => {
		return [{
			value: 'list',
			label: messages.boards.byPopularity
		}, {
			value: 'by-category',
			label: messages.boards.byCategory
		}]
	}, [messages])

	const onChange = useCallback((value) => {
		switch (value) {
			case 'list':
				return onChangeViewAllChannels()
			case 'by-category':
				return onChangeViewByCategory()
		}
	}, [
		onChangeViewAllChannels,
		onChangeViewByCategory
	])

	return (
		<div className="ChannelsViewSwitcher">
			<Select
				value={view}
				onChange={onChange}
				options={options}/>
		</div>
	)
}

ChannelsViewSwitcher.propTypes = {
	view: PropTypes.oneOf(['list', 'by-category']).isRequired,
	onChangeViewAllChannels: PropTypes.func.isRequired,
	onChangeViewByCategory: PropTypes.func.isRequired
}

// // Don't re-render `<Channels/>` on page navigation (on `route` change).
// // Re-rendering `<Channels/>` is about `150` ms (which is a lot).
// // (seems that rendering a `<Link/>` is a long time).
// Channels = React.memo(Channels)

function Channel({
	channel,
	isSelected
}) {
	const [isHovered, setHovered] = useState()
	const [isActive, setActive] = useState()
	// https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/pointerout_event
	// The pointerout event is fired for several reasons including:
	// * pointing device is moved out of the hit test boundaries of an element (`pointerleave`);
	// * firing the pointerup event for a device that does not support hover (see `pointerup`);
	// * after firing the pointercancel event (see `pointercancel`);
	// * when a pen stylus leaves the hover range detectable by the digitizer.
	const onPointerEnter = useCallback(() => setHovered(true), [])
	const onPointerOut = useCallback(() => {
		setHovered(false)
		setActive(false)
	}, [])
	const onPointerDown = useCallback(() => setActive(true), [])
	const onPointerUp = useCallback(() => setActive(false), [])
	const onDragStart = onPointerOut
	// Safari doesn't support pointer events.
	// https://caniuse.com/#feat=pointer
	// https://webkit.org/status/#?search=pointer%20events
	// onPointerDown={onPointerDown}
	// onPointerUp={onPointerUp}
	// onPointerEnter={onPointerEnter}
	// onPointerOut={onPointerOut}
	return (
		<React.Fragment>
			<Link
				to={getUrl(channel.id)}
				title={channel.title}
				tabIndex={-1}
				onDragStart={onDragStart}
				onMouseDown={onPointerDown}
				onMouseUp={onPointerUp}
				onMouseEnter={onPointerEnter}
				onMouseLeave={onPointerOut}
				className={classNames('ChannelsListChannel-url', {
					'ChannelsListChannel-url--selected': isSelected,
					'ChannelsListChannel-url--hover': isHovered,
					'ChannelsListChannel-url--active': isActive
				})}>
				<ChannelUrl
					channelId={channel.id}
					selected={isSelected}
					hovered={isHovered}
					active={isActive}/>
			</Link>
			<Link
				to={getUrl(channel.id)}
				title={channel.title}
				onDragStart={onDragStart}
				onMouseDown={onPointerDown}
				onMouseUp={onPointerUp}
				onMouseEnter={onPointerEnter}
				onMouseLeave={onPointerOut}
				className={classNames('ChannelsListChannel-title', {
					'ChannelsListChannel-title--selected': isSelected,
					'ChannelsListChannel-title--hover': isHovered,
					'ChannelsListChannel-title--active': isActive
				})}>
				{channel.title}
			</Link>
		</React.Fragment>
	)
}

Channel.propTypes = {
	channel: PropTypes.shape(channelShape).isRequired,
	isSelected: PropTypes.bool
}

function ChannelsList({ className, children }) {
	return (
		<div className={className}>
			{children.map((item) => (
				<ChannelsListItem {...item}/>
			))}
		</div>
	)
}

ChannelsList.propTypes = {
	className: PropTypes.string,
	children: PropTypes.arrayOf(PropTypes.shape({
		channel: PropTypes.object,
		selected: PropTypes.bool,
		first: PropTypes.bool,
		category: PropTypes.string
	})).isRequired
}

function ChannelsListItem({
	category,
	channel,
	selected,
	first
}) {
	if (channel) {
		return (
			<Channel
				channel={channel}
				isSelected={selected}/>
		)
	}
	return (
		<React.Fragment key={category || '—'}>
			<div className="ChannelsListSectionHeader-urlPlaceholder"/>
			<h2 className={classNames('ChannelsListSectionHeader-title', {
				'ChannelsListSectionHeader-title--first': first
			})}>
				{category}
			</h2>
		</React.Fragment>
	)
}

ChannelsListItem.propTypes = {
	channel: PropTypes.object,
	category: PropTypes.string,
	selected: PropTypes.bool,
	first: PropTypes.bool
}

// Re-rendering the full `<Channels/>` list is about `150` ms (which is a lot).
// (seems that rendering a `<Link/>` is a long time).
ChannelsListItem = React.memo(ChannelsListItem)

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