import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import ChannelHeaderToolbar from './ChannelHeaderToolbar.js'
import ChannelThreadHeaderChannel from '../../components/ChannelThreadHeaderChannel.js'
import ChannelThreadHeaderSource, { ChannelThreadHeaderSourcePlaceholder } from '../../components/ChannelThreadHeaderSource.js'

import useOnChannelLinkClick from '../useOnChannelLinkClick.js'

import './ChannelHeader.css'

export default function ChannelHeader({
	alignTitle,

	// `channelLayout` / `channelSorting` should be cached at the initial render
	// on the `Channel` page and then passed as a property into this component.
	//
	// Otherwise, if `channelLayout` / `channelSorting` was read from its latest value
	// from `state.settings`, it could result in an incorrect behavior of `<VirtualScroller/>`
	// when navigating "Back" to the `Channel` page.
	//
	// In that case, the cached threads-list-item sizes that would be read from the cached
	// `<VirtualScroller/>` state would correspond to the old `channelLayout` / `channelSorting` —
	// the one that was selected when the user was still on the `Channel` page — while the user might
	// have changed the selected `channelLayout` / `channelSorting` to some other value in some other
	// web browser tab since the channel page has initially been rendered.
	//
	// And when the user would navigate "Back" to the `Channel` page, it would attempt to render
	// the list of threads using the cached `<VirtualScroller/>` item heights that had been measured
	// for a different `channelLayout` / `channelSorting` parameter, and, therefore, for a different
	// list of thread.
	//
	// So, after "Back" navigation, the `Channel` page should be restored exactly to the state
	// it was before navigating from it, and that "exact" state would include the
	// `channelLayout` / `channelSorting` setting value, and that's why the original
	// `channelLayout` / `channelSorting` gets saved in Redux
	// in `state.channel` state object rather than just read from `state.settings`.
	//
	channelLayout,
	channelSorting,

	canChangeChannelLayout,
	canChangeChannelSorting,

	onChannelViewWillChange,
	onChannelViewDidChange,

	className
}) {
	const channel = useSelector(state => state.data.channel)

	const onChannelLinkClick = useOnChannelLinkClick({
		channelId: channel.id
	})

	const toolbar = (
		<ChannelHeaderToolbar
			canChangeChannelLayout={canChangeChannelLayout}
			canChangeChannelSorting={canChangeChannelSorting}
			channelLayout={channelLayout}
			channelSorting={channelSorting}
		/>
	)

	return (
		<header className={classNames('ChannelHeader', className)}>
			{alignTitle === 'center' &&
				React.cloneElement(toolbar, {
					className: 'ChannelHeader-toolbarSizePlaceholder'
				})
			}
			<h1 className={classNames('ChannelHeader-heading', {
				'ChannelHeader-heading--alignContentCenter': alignTitle === 'center'
			})}>
				<ChannelThreadHeaderSource/>
				<ChannelThreadHeaderChannel
					channel={channel}
					showTitle
					onClick={onChannelLinkClick}
				/>
				<ChannelThreadHeaderSourcePlaceholder/>
			</h1>
			{toolbar}
		</header>
	)
}

ChannelHeader.propTypes = {
	alignTitle: PropTypes.oneOf(['start', 'center']).isRequired,
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
	onChannelViewDidChange: PropTypes.func,
	className: PropTypes.string
}