import React, { useState, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { useSelector, useDispatch } from 'react-redux'
import { ExpandableMenu, List } from 'react-responsive-ui'

import Button from 'frontend-lib/components/ButtonAsync.js'

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

import SortIcon from 'frontend-lib/icons/sort-thin.svg'

import './ChannelHeaderToolbar.css'

export default function ChannelHeaderToolbar({
	channelLayout,
	channelSorting,
	canChangeChannelLayout,
	canChangeChannelSorting,
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

	const setChannelLayout = useCallback((layout) => {
		if (layout !== channelLayout) {
			setChannelView({ layout, sorting: channelSorting })
		}
	}, [
		setChannelView,
		channelLayout,
		channelSorting
	])

	const setChannelSorting = useCallback((sorting) => {
		if (sorting !== channelSorting) {
			setChannelView({ layout: channelLayout, sorting })
		}
	}, [
		setChannelView,
		channelLayout,
		channelSorting
	])

	const [isSearchBarShown, setSearchBarShown] = useState()

	const dispatch = useDispatch()
	const messages = useMessages()

	const items = useMemo(() => {
		let items = [
			{
				title: messages.actions.search,
				onClick: () => dispatch(notify(messages.notImplemented)),
				// onClick: () => setSearchBarShown(!isSearchBarShown),
				isSelected: isSearchBarShown,
				icon: SearchIconOutline,
				iconActive: SearchIconFill,
				size: 's'
			}
		]

		if (canChangeChannelLayout || canChangeChannelSorting) {
			items = [{ type: 'separator' }].concat(items)
		}

		return items
	}, [
		messages,
		isSearchBarShown,
		setSearchBarShown,
		canChangeChannelLayout,
		canChangeChannelSorting
	])

	const channelLayoutButtonToggleElement = useMemo(() => {
		let Icon
		switch (channelLayout) {
			case 'threadsList':
				Icon = ThreadsIconOutline
				break
			case 'threadsListWithLatestComments':
				Icon = ThreadWithCommentsIconOutline
				break
			case 'threadsTiles':
				Icon = ThreadTilesIconOutline
				break
		}
		return (
			<Icon className="ChannelHeaderToolbar-channelLayoutIcon"/>
		)
	}, [channelLayout])

	const channelLayoutButtonProps = useMemo(() => {
		return {
			title: messages.channelLayout.title,
			wait: isSettingChannelView,
			className: 'ChannelHeaderToolbar-channelLayoutButton',
			children: channelLayoutButtonToggleElement
		}
	}, [
		channelLayout,
		isSettingChannelView,
		messages,
		channelLayoutButtonToggleElement
	])

	const channelSortingButtonToggleElement = useMemo(() => {
		return (
			<SortIcon
				className="ChannelHeaderToolbar-channelSortingButtonIcon"
			/>
		)
	}, [])

	const channelSortingButtonProps = useMemo(() => {
		return {
			title: messages.channelSorting.title,
			wait: isSettingChannelView,
			className: 'ChannelHeaderToolbar-channelSortingButton',
			children: channelSortingButtonToggleElement
		}
	}, [
		isSettingChannelView,
		messages,
		channelSortingButtonToggleElement
	])

	return (
		<div className="ChannelHeaderToolbar">
			{canChangeChannelLayout &&
				<ExpandableMenu
					highlightSelectedItem
					alignment="right"
					value={channelLayout}
					buttonComponent={ChannelLayoutOrSortingButton}
					buttonProps={channelLayoutButtonProps}
					className="ChannelHeaderToolbar-channelLayout">
					{CHANNEL_LAYOUT_OPTIONS.map(({ icon: Icon, value }) => (
						<List.Item
							key={value}
							value={value}
							label={messages.channelLayout.options[value]}
							onClick={() => setChannelLayout(value)}>
							<Icon className="ChannelHeaderToolbar-channelLayoutIcon"/>
						</List.Item>
					))}
				</ExpandableMenu>
			}
			{canChangeChannelSorting &&
				<ExpandableMenu
					highlightSelectedItem
					alignment="right"
					value={channelSorting}
					buttonComponent={ChannelLayoutOrSortingButton}
					buttonProps={channelSortingButtonProps}
					className="ChannelHeaderToolbar-channelSorting">
					{CHANNEL_SORTING_OPTIONS.map(({ value }) => (
						<List.Item
							key={value}
							value={value}
							onClick={() => setChannelSorting(value)}>
							{messages.channelSorting.options[value]}
						</List.Item>
					))}
				</ExpandableMenu>
			}
			<Toolbar items={items} className={classNames('ChannelHeaderToolbar-toolbar', {
				'ChannelHeaderToolbar-toolbar--afterChannelLayoutOrSortingSelect': canChangeChannelLayout || canChangeChannelSorting
			})}/>
		</div>
	)
}

ChannelHeaderToolbar.propTypes = {
	channelLayout: PropTypes.oneOf([
		'threadsList',
		'threadsListWithLatestComments',
		'threadsTiles'
	]).isRequired,
	channelSorting: PropTypes.oneOf([
		'default',
		'popular'
	]).isRequired,
	canChangeChannelLayout: PropTypes.bool,
	canChangeChannelSorting: PropTypes.bool,
	onChannelViewWillChange: PropTypes.func,
	onChannelViewDidChange: PropTypes.func
}

const ChannelLayoutOrSortingButton = React.forwardRef((props, ref) => (
	<Button {...props} ref={ref}/>
))

const CHANNEL_LAYOUT_OPTIONS = [{
	icon: ThreadsIconOutline,
	value: 'threadsList'
}, {
	icon: ThreadWithCommentsIconOutline,
	value: 'threadsListWithLatestComments'
}, {
	icon: ThreadTilesIconOutline,
	value: 'threadsTiles'
}]

const CHANNEL_SORTING_OPTIONS = [{
	value: 'default'
}, {
	value: 'popular'
}]