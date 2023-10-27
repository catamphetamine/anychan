import React, { useState, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { useSelector } from 'react-redux'
import { ExpandableMenu, List } from 'react-responsive-ui'

import Button from 'frontend-lib/components/ButtonAsync.js'

import Toolbar from '../../components/Toolbar.js'

import useMessages from '../../hooks/useMessages.js'
import useDataSource from '../../hooks/useDataSource.js'
import useChannelView from './useChannelView.js'
import useChannelHeaderToolbarFavorite from './useChannelHeaderToolbarFavorite.js'
import useChannelHeaderToolbarSearch from './useChannelHeaderToolbarSearch.js'

import ThreadTilesIconOutline from '../../../assets/images/icons/toolbar/thread-tiles-outline.svg'
import ThreadsIconOutline from '../../../assets/images/icons/toolbar/threads-icon-outline.svg'
// `class="st0"` is used there to work around `svgr` bug.
// https://github.com/gregberge/svgr/issues/771
// Or maybe "play" with "SVGO" config options.
// https://react-svgr.com/docs/options/
import ThreadWithCommentsIconOutline from '../../../assets/images/icons/toolbar/thread-with-comments-icon-outline.svg'

import PopularThreadsIconOutline from '../../../assets/images/icons/toolbar/popular-threads-icon-outline.svg'
import PopularThreadsIconFill from '../../../assets/images/icons/toolbar/popular-threads-icon-fill.svg'

import SortIcon from 'frontend-lib/icons/sort-thin.svg'

import './ChannelHeaderToolbar.css'

export default function ChannelHeaderToolbar({
	search,
	searchButtonRef,
	onSearchClick,
	channelLayout,
	channelSorting,
	canChangeChannelLayout,
	canChangeChannelSorting,
	onChannelViewWillChange,
	onChannelViewDidChange
}) {
	const {
		isSettingChannelView,
		setChannelView
	} = useChannelView({
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

	const setChannelSorting = useCallback(async (sorting) => {
		if (sorting !== channelSorting) {
			await setChannelView({ layout: channelLayout, sorting })
		}
	}, [
		setChannelView,
		channelLayout,
		channelSorting
	])

	const messages = useMessages()
	const dataSource = useDataSource()

	const channelLayoutItems = useMemo(() => [
		{
			title: messages.channelLayout.options.threadsTiles,
			onClick: () => setChannelLayout('threadsTiles'),
			isSelected: channelLayout === 'threadsTiles',
			icon: ThreadTilesIconOutline,
			wait: isSettingChannelView,
			className: 'ChannelHeaderToolbar-channelLayoutButton'
		},
		{
			title: messages.channelLayout.options.threadsList,
			onClick: () => setChannelLayout('threadsList'),
			isSelected: channelLayout === 'threadsList',
			icon: ThreadsIconOutline,
			wait: isSettingChannelView,
			className: 'ChannelHeaderToolbar-channelLayoutButton'
		},
		{
			title: messages.channelLayout.options.threadsListWithLatestComments,
			onClick: () => setChannelLayout('threadsListWithLatestComments'),
			isSelected: channelLayout === 'threadsListWithLatestComments',
			icon: ThreadWithCommentsIconOutline,
			wait: isSettingChannelView,
			className: 'ChannelHeaderToolbar-channelLayoutButton'
		}
	], [
		channelLayout,
		setChannelLayout,
		isSettingChannelView,
		messages
	])

	const channelSortingPopularItem = useMemo(() => {
		return {
			title: messages.channelSorting.options.popular,
			onClick: async () => {
				if (channelSorting === 'popular') {
					await setChannelSorting('default')
				} else {
					await setChannelSorting('popular')
				}
			},
			// icon: FireIconOutline,
			// iconSelected: FireIconFill,
			isSelected: channelSorting === 'popular',
			icon: PopularThreadsIconOutline,
			iconSelected: PopularThreadsIconFill,
			className: 'ChannelHeaderToolbar-sortByPopularityButton',
 			wait: isSettingChannelView,
			// className: 'ChannelHeaderToolbar-channelSortingButton'
		}
	}, [
		channelSorting,
		setChannelSorting,
		isSettingChannelView,
		messages
	])

	const channelHeaderToolbarFavorite = useChannelHeaderToolbarFavorite()
	const channelHeaderToolbarSearch = useChannelHeaderToolbarSearch({
		onSearchClick,
		searchButtonRef
	})

	const items = useMemo(() => {
		let items = []

		if (canChangeChannelLayout || canChangeChannelSorting) {
			items = items.concat(channelLayoutItems)
			items.push({ type: 'separator' })
		}

		if (dataSource.supportsFeature && dataSource.supportsFeature('getThreads.sortByRating')) {
			items.push(channelSortingPopularItem)
		}

		items.push(channelHeaderToolbarFavorite)

		if (search) {
			items.push(channelHeaderToolbarSearch)
		}

		return items
	}, [
		search,
		channelLayoutItems,
		channelSortingPopularItem,
		canChangeChannelLayout,
		canChangeChannelSorting,
		messages,
		channelHeaderToolbarFavorite,
		channelHeaderToolbarSearch
	])

	return (
		<div className="ChannelHeaderToolbar">
			{/*canChangeChannelLayout &&
				<ChannelLayoutSelect
					channelLayout={channelLayout}
					setChannelLayout={setChannelLayout}
					isSettingChannelView={isSettingChannelView}
				/>
			*/}
			{/*canChangeChannelSorting &&
				<ChannelSortingSelect
					channelSorting={channelSorting}
					setChannelSorting={setChannelSorting}
					isSettingChannelView={isSettingChannelView}
				/>
			*/}
			<Toolbar items={items} className={classNames('ChannelHeaderToolbar-toolbar', {
				// 'ChannelHeaderToolbar-toolbar--afterChannelLayoutOrSortingSelect': canChangeChannelLayout || canChangeChannelSorting
			})}/>
		</div>
	)
}

ChannelHeaderToolbar.propTypes = {
	search: PropTypes.bool,
	searchButtonRef: PropTypes.object,
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

function ChannelLayoutSelect({
	channelLayout,
	setChannelLayout,
	isSettingChannelView
}) {
	const messages = useMessages()

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

	return (
		<ExpandableMenu
			highlightSelectedItem
			alignment="right"
			value={channelLayout}
			buttonComponent={ChannelLayoutOrSortingButton}
			buttonProps={channelLayoutButtonProps}
			className="ChannelHeaderToolbar-channelLayoutSelect">
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
	)
}

function ChannelSortingSelect({
	channelSorting,
	setChannelSorting,
	isSettingChannelView
}) {
	const messages = useMessages()

	const channelSortingButtonToggleElement = useMemo(() => {
		return (
			<SortIcon
				className="ChannelHeaderToolbar-channelSortingIcon"
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
		<ExpandableMenu
			highlightSelectedItem
			alignment="right"
			value={channelSorting}
			buttonComponent={ChannelLayoutOrSortingButton}
			buttonProps={channelSortingButtonProps}
			className="ChannelHeaderToolbar-channelSortingSelect">
			{CHANNEL_SORTING_OPTIONS.map(({ value }) => (
				<List.Item
					key={value}
					value={value}
					onClick={() => setChannelSorting(value)}>
					{messages.channelSorting.options[value]}
				</List.Item>
			))}
		</ExpandableMenu>
	)
}