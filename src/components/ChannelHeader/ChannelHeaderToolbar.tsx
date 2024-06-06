import type { Channel, ChannelLayout, ChannelSorting, DataSource } from '@/types'

import React, { useMemo, useCallback, RefObject } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

// // @ts-expect-error
// import { ExpandableMenu, List } from 'react-responsive-ui'

// import Button from 'frontend-lib/components/ButtonAsync.js'

import Toolbar from '../Toolbar.js'

import useMessages from '../../hooks/useMessages.js'
import useDataSource from '../../hooks/useDataSource.js'
import useChannelView from './useChannelView.js'
import useChannelHeaderToolbarFavorite from './useChannelHeaderToolbarFavorite.js'
import useChannelHeaderToolbarSearch from './useChannelHeaderToolbarSearch.js'

import { channel as channelType } from '../../PropTypes.js'

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
	channel,
	search,
	searchButtonRef,
	onSearchClick,
	channelLayout,
	channelSorting,
	canChangeChannelLayout,
	canChangeChannelSorting,
	onChannelViewWillChange,
	onChannelViewDidChange
}: ChannelHeaderToolbarProps) {
	const messages = useMessages()
	const dataSource = useDataSource()

	const {
		isSettingChannelView,
		setChannelView
	} = useChannelView({
		channel,
		onChannelViewWillChange,
		onChannelViewDidChange
	})

	const setChannelLayout = useCallback((layout: ChannelLayout) => {
		if (layout !== channelLayout && isLayoutSupportedByDataSource(layout, dataSource)) {
			setChannelView({ layout, sorting: channelSorting })
		}
	}, [
		setChannelView,
		channelLayout,
		channelSorting,
		dataSource
	])

	const setChannelSorting = useCallback(async (sorting: ChannelSorting) => {
		if (sorting !== channelSorting) {
			await setChannelView({ layout: channelLayout, sorting })
		}
	}, [
		setChannelView,
		channelLayout,
		channelSorting
	])

	const channelLayoutItems = useMemo(() => {
		const items = [
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
			}
		]

		if (isLayoutSupportedByDataSource('threadsListWithLatestComments', dataSource)) {
			items.push({
				title: messages.channelLayout.options.threadsListWithLatestComments,
				onClick: () => setChannelLayout('threadsListWithLatestComments'),
				isSelected: channelLayout === 'threadsListWithLatestComments',
				icon: ThreadWithCommentsIconOutline,
				wait: isSettingChannelView,
				className: 'ChannelHeaderToolbar-channelLayoutButton'
			})
		}

		return items
	}, [
		channelLayout,
		setChannelLayout,
		isSettingChannelView,
		messages,
		dataSource
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

	const channelHeaderToolbarFavorite = useChannelHeaderToolbarFavorite({
		channel
	})

	const channelHeaderToolbarSearch = useChannelHeaderToolbarSearch({
		onSearchClick,
		searchButtonRef
	})

	const items = useMemo(() => {
		let items: ToolbarItem[] = []

		if (canChangeChannelLayout && canChangeChannelSorting) {
			items = items.concat(channelLayoutItems)
			items.push({ type: 'separator' })
		}

		if (canChangeChannelSorting) {
			if (dataSource.supportsFeature('getThreads.sortByRatingDesc')) {
				items.push(channelSortingPopularItem)
			}
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
	channel: channelType,
	search: PropTypes.bool,
	searchButtonRef: PropTypes.object,
	channelLayout: PropTypes.oneOf([
		'threadsList',
		'threadsListWithLatestComments',
		'threadsTiles'
	] as const).isRequired,
	channelSorting: PropTypes.oneOf([
		'default',
		'popular'
	] as const).isRequired,
	canChangeChannelLayout: PropTypes.bool,
	canChangeChannelSorting: PropTypes.bool,
	onChannelViewWillChange: PropTypes.func,
	onChannelViewDidChange: PropTypes.func,
	onSearchClick: PropTypes.func.isRequired
}

interface ChannelHeaderToolbarProps {
	channel: Channel,
	search?: boolean,
	searchButtonRef?: RefObject<HTMLButtonElement>,
	channelLayout: ChannelLayout,
	channelSorting: ChannelSorting,
	canChangeChannelLayout?: boolean,
	canChangeChannelSorting?: boolean,
	onChannelViewWillChange?: () => void,
	onChannelViewDidChange?: () => void,
	onSearchClick?: () => void
}

// const ChannelLayoutOrSortingButton = React.forwardRef((props, ref) => (
// 	<Button {...props} ref={ref}/>
// ))

// const CHANNEL_LAYOUT_OPTIONS = [{
// 	icon: ThreadsIconOutline,
// 	value: 'threadsList'
// }, {
// 	icon: ThreadWithCommentsIconOutline,
// 	value: 'threadsListWithLatestComments'
// }, {
// 	icon: ThreadTilesIconOutline,
// 	value: 'threadsTiles'
// }] as const

// const CHANNEL_SORTING_OPTIONS = [{
// 	value: 'default'
// }, {
// 	value: 'popular'
// }] as const

// function ChannelLayoutSelect({
// 	channelLayout,
// 	setChannelLayout,
// 	isSettingChannelView
// }: ChannelLayoutSelectProps) {
// 	const messages = useMessages()
// 	const dataSource = useDataSource()

// 	const channelLayoutButtonToggleElement = useMemo(() => {
// 		let Icon
// 		switch (channelLayout) {
// 			case 'threadsList':
// 				Icon = ThreadsIconOutline
// 				break
// 			case 'threadsListWithLatestComments':
// 				Icon = ThreadWithCommentsIconOutline
// 				break
// 			case 'threadsTiles':
// 				Icon = ThreadTilesIconOutline
// 				break
// 		}
// 		return (
// 			<Icon className="ChannelHeaderToolbar-channelLayoutIcon"/>
// 		)
// 	}, [channelLayout])

// 	const channelLayoutButtonProps = useMemo(() => {
// 		return {
// 			title: messages.channelLayout.title,
// 			wait: isSettingChannelView,
// 			className: 'ChannelHeaderToolbar-channelLayoutButton',
// 			children: channelLayoutButtonToggleElement
// 		}
// 	}, [
// 		channelLayout,
// 		isSettingChannelView,
// 		messages,
// 		channelLayoutButtonToggleElement
// 	])

// 	const channelLayoutOptions = useMemo(() => {
// 		return CHANNEL_LAYOUT_OPTIONS.filter((option) => {
// 			return isLayoutSupportedByDataSource(option.value, dataSource)
// 		})
// 	}, [
// 		dataSource
// 	])

// 	return (
// 		<ExpandableMenu
// 			highlightSelectedItem
// 			alignment="right"
// 			value={channelLayout}
// 			buttonComponent={ChannelLayoutOrSortingButton}
// 			buttonProps={channelLayoutButtonProps}
// 			className="ChannelHeaderToolbar-channelLayoutSelect">
// 			{channelLayoutOptions.map(({ icon: Icon, value }) => (
// 				<List.Item
// 					key={value}
// 					value={value}
// 					label={messages.channelLayout.options[value]}
// 					onClick={() => setChannelLayout(value)}>
// 					<Icon className="ChannelHeaderToolbar-channelLayoutIcon"/>
// 				</List.Item>
// 			))}
// 		</ExpandableMenu>
// 	)
// }

// ChannelLayoutSelect.propTypes = {
// 	channelLayout: PropTypes.string,
// 	setChannelLayout: PropTypes.func.isRequired,
// 	isSettingChannelView: PropTypes.bool
// }

// interface ChannelLayoutSelectProps {
// 	channelLayout?: ChannelLayout,
// 	setChannelLayout: (channelLayout: ChannelLayout) => void,
// 	isSettingChannelView?: boolean
// }

// function ChannelSortingSelect({
// 	channelSorting,
// 	setChannelSorting,
// 	isSettingChannelView
// }: ChannelSortingSelectProps) {
// 	const messages = useMessages()

// 	const channelSortingButtonToggleElement = useMemo(() => {
// 		return (
// 			<SortIcon
// 				className="ChannelHeaderToolbar-channelSortingIcon"
// 			/>
// 		)
// 	}, [])

// 	const channelSortingButtonProps = useMemo(() => {
// 		return {
// 			title: messages.channelSorting.title,
// 			wait: isSettingChannelView,
// 			className: 'ChannelHeaderToolbar-channelSortingButton',
// 			children: channelSortingButtonToggleElement
// 		}
// 	}, [
// 		isSettingChannelView,
// 		messages,
// 		channelSortingButtonToggleElement
// 	])

// 	return (
// 		<ExpandableMenu
// 			highlightSelectedItem
// 			alignment="right"
// 			value={channelSorting}
// 			buttonComponent={ChannelLayoutOrSortingButton}
// 			buttonProps={channelSortingButtonProps}
// 			className="ChannelHeaderToolbar-channelSortingSelect">
// 			{CHANNEL_SORTING_OPTIONS.map(({ value }) => (
// 				<List.Item
// 					key={value}
// 					value={value}
// 					onClick={() => setChannelSorting(value)}>
// 					{messages.channelSorting.options[value]}
// 				</List.Item>
// 			))}
// 		</ExpandableMenu>
// 	)
// }

// ChannelSortingSelect.propTypes = {
// 	channelSorting: PropTypes.string,
// 	setChannelSorting: PropTypes.func.isRequired,
// 	isSettingChannelView: PropTypes.bool
// }

// interface ChannelSortingSelectProps {
// 	channelSorting?: ChannelSorting,
// 	setChannelSorting: (channelSorting: ChannelSorting) => void,
// 	isSettingChannelView?: boolean
// }

type ToolbarItem = ToolbarItemInteractive | ToolbarItemSeparator

interface ToolbarItemSeparator {
	type: 'separator'
}

interface ToolbarItemInteractive {
	title: string,
	onClick: () => void,
	isSelected?: boolean,
	icon: React.ElementType,
	wait?: boolean,
	className?: string
}

function isLayoutSupportedByDataSource(layout: ChannelLayout, dataSource: DataSource) {
	switch (layout) {
		case 'threadsListWithLatestComments':
			return dataSource.supportsFeature('getThread.withLatestComments')
		default:
			return true
	}
}