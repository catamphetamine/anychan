import React, { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'

import Toolbar from '../../components/Toolbar.js'

import useMessages from '../../hooks/useMessages.js'
import useChannelView from './useChannelView.js'

import { notify } from '../../redux/notifications.js'

import ThreadsIconOutline from '../../../assets/images/icons/toolbar/threads-icon-outline.svg'
import ThreadTilesIconOutline from '../../../assets/images/icons/toolbar/thread-tiles-outline.svg'
import PopularThreadsIconOutline from '../../../assets/images/icons/toolbar/popular-threads-icon-outline.svg'

// `class="st0"` is used there to work around `svgr` bug.
// https://github.com/gregberge/svgr/issues/771
// Or maybe "play" with "SVGO" config options.
// https://react-svgr.com/docs/options/
import ThreadWithCommentsIconOutline from '../../../assets/images/icons/toolbar/thread-with-comments-icon-outline.svg'

import SearchIconOutline from 'frontend-lib/icons/fill-and-outline/search-outline.svg'
import SearchIconFill from 'frontend-lib/icons/fill-and-outline/search-fill.svg'

export default function ChannelHeaderToolbar({
	channelView,
	onChannelViewWillChange,
	onChannelViewDidChange
}) {
	const channel = useSelector(state => state.data.channel)

	const {
		isSettingChannelView,
		setChannelView
	} = useChannelView({
		channel,
		onChannelViewWillChange,
		onChannelViewDidChange
	})

	const [isSearchBarShown, setSearchBarShown] = useState()

	const dispatch = useDispatch()
	const messages = useMessages()

	const items = useMemo(() => [
		{
			title: messages.channelViewMode.newThreads,
			onClick: () => setChannelView('new-threads'),
			isSelected: channelView === 'new-threads',
			icon: ThreadsIconOutline,
			wait: isSettingChannelView,
			className: 'Toolbar-item--channelView'
			// className: classNames('Toolbar-item--channelView', 'Toolbar-item--channelViewNewThreads')
		},
		{
			title: messages.channelViewMode.newComments,
			onClick: () => setChannelView('new-comments'),
			isSelected: channelView === 'new-comments',
			icon: ThreadWithCommentsIconOutline,
			wait: isSettingChannelView,
			className: 'Toolbar-item--channelView'
		},
		{
			title: messages.channelViewMode.popular,
			onClick: () => setChannelView('popular'),
			isSelected: channelView === 'popular',
			icon: PopularThreadsIconOutline,
			// icon: FireIconOutline,
			// iconActive: FireIconFill,
			wait: isSettingChannelView,
			className: 'Toolbar-item--channelView'
			// className: classNames('Toolbar-item--channelView', 'Toolbar-item--channelViewRightmost')
		},
		{
			title: messages.channelViewMode.newThreadsTiles,
			onClick: () => setChannelView('new-threads-tiles'),
			isSelected: channelView === 'new-threads-tiles',
			icon: ThreadTilesIconOutline,
			wait: isSettingChannelView,
			className: 'Toolbar-item--channelView'
		},
		{
			type: 'separator'
		},
		{
			title: messages.actions.search,
			onClick: () => dispatch(notify(messages.notImplemented)),
			// onClick: () => setSearchBarShown(!isSearchBarShown),
			isSelected: isSearchBarShown,
			icon: SearchIconOutline,
			iconActive: SearchIconFill,
			size: 's'
		}
	], [
		messages,
		channelView,
		isSettingChannelView,
		setChannelView,
		isSearchBarShown,
		setSearchBarShown
	])

	return (
		<Toolbar
			items={items}
			isSearchBarShown={isSearchBarShown}
			setSearchBarShown={setSearchBarShown}
			channelView={channelView}
			setChannelView={setChannelView}
			isSettingChannelView={isSettingChannelView}
		/>
	)
}

ChannelHeaderToolbar.propTypes = {
	channelView: PropTypes.oneOf([
		'new-threads',
		'new-threads-tiles',
		'new-comments',
		'popular'
	]).isRequired,
	onChannelViewWillChange: PropTypes.func,
	onChannelViewDidChange: PropTypes.func
}