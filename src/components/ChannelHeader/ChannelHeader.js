import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Link } from 'react-pages'
import classNames from 'classnames'

import { getProviderId, getProvider } from '../../provider.js'

import Toolbar from '../../components/Toolbar.js'
import ProviderLogo from '../../components/ProviderLogo.js'
import ChannelUrl from '../../components/ChannelUrl.js'

import useChannelView from './useChannelView.js'

import './ChannelHeader.css'

export default function ChannelHeader({
	alignTitle,

	// `channelView` should be cached at the initial render on the `Channel` page
	// and then passed as a property into this component.
	//
	// Otherwise, if `channelView` was read from its latest value from `state.settings`,
	// it could result in an incorrect behavior of `<VirtualScroller/>` when navigating "Back"
	// to the `Channel` page.
	//
	// In that case, the cached threads-list-item sizes that would be read from the cached
	// `<VirtualScroller/>` state would correspond to the old `channelView` — the one that was
	// selected when the user was still on the `Channel` page — while the user might have changed
	// the selected `channelView` to some other value in some other web browser tab
	// since the channel page has initially been rendered.
	//
	// And when the user would navigate "Back" to the `Channel` page, it would attempt to render
	// the list of threads using the cached `<VirtualScroller/>` item heights that had been measured
	// for a different `channelView` parameter, and, therefore, for a different list of thread.
	//
	// So, after "Back" navigation, the `Channel` page should be restored exactly to the state
	// it was before navigating from it, and that "exact" state would include the `channelView`
	// setting value, and that's why the original `channelView` gets saved in Redux
	// in `state.channel` state object rather than just read from `state.settings`.
	//
	channelView,

	onChannelViewWillChange,
	onChannelViewDidChange
}) {
	const channel = useSelector(state => state.data.channel)

	const [isSearchBarShown, setSearchBarShown] = useState()

	const {
		isSettingChannelView,
		setChannelView
	} = useChannelView({
		channel,
		onChannelViewWillChange,
		onChannelViewDidChange
	})

	const toolbar = (
		<Toolbar
			mode="channel"
			isSearchBarShown={isSearchBarShown}
			setSearchBarShown={setSearchBarShown}
			channelView={channelView}
			setChannelView={setChannelView}
			isSettingChannelView={isSettingChannelView}
		/>
	)

	return (
		<header className="ChannelHeader">
			{alignTitle === 'center' &&
				React.cloneElement(toolbar, {
					className: 'ChannelHeader-toolbarSizePlaceholder'
				})
			}
			<h1 className={classNames('ChannelHeader-heading', {
				'ChannelHeader-heading--alignContentCenter': alignTitle === 'center'
			})}>
				<Link
					to="/"
					title={getProvider().title}
					className="ChannelHeader-providerLogoLink">
					<ProviderLogo
						className="ChannelHeader-providerLogo"
					/>
				</Link>
				<ChannelUrl
					channelId={channel.id}
					className="ChannelHeader-channelId"
				/>
				{channel.title}
				<ProviderLogo
					className="ChannelHeader-providerLogo ChannelHeader-providerLogo--spaceEquivalent"
				/>
			</h1>
			{toolbar}
		</header>
	)
}

ChannelHeader.propTypes = {
	alignTitle: PropTypes.oneOf(['start', 'center']).isRequired,
	channelView: PropTypes.oneOf(['new-threads', 'new-comments']).isRequired,
	onChannelViewWillChange: PropTypes.func,
	onChannelViewDidChange: PropTypes.func,
}