import React, { useState, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-pages'
import { useSelector, useDispatch } from 'react-redux'
import classNames from 'classnames'

import {
	setVirtualScrollerState,
	setScrollPosition,
	setChannelView
} from '../../redux/channel.js'

import { getProviderId, getProvider } from '../../provider.js'
import getMessages from '../../messages/index.js'

import Toolbar from '../../components/Toolbar.js'
import CommentsList from '../../components/CommentsList.js'
import ProviderLogo from '../../components/ProviderLogo.js'
import ChannelUrl from '../../components/ChannelUrl.js'

import ChannelThread from './ChannelThread.js'

import useLocale from '../../hooks/useLocale.js'
import useUnreadCommentWatcher from './useUnreadCommentWatcher.js'
import useUpdateAttachmentThumbnailMaxWidth from './useUpdateAttachmentThumbnailMaxWidth.js'
import useOnThreadClick from './useOnThreadClick.js'

import { saveChannelView } from '../../redux/settings.js'

import getChannelPageMeta from './getChannelPageMeta.js'
import loadChannelPage from './loadChannelPage.js'

import './Channel.css'

function ChannelPage() {
	const channel = useSelector(state => state.data.channel)
	const threads = useSelector(state => state.data.threads)

	const locale = useLocale()
	const censoredWords = useSelector(state => state.settings.settings.censoredWords)

	const {
		virtualScrollerState: initialVirtualScrollerState,
		scrollPosition: initialScrollPosition,
		// `latestSeenThreadId` should be determined on the initial render,
		// and then it shouldn't change, so that `VirtualScroller` state stays the same
		// during Back / Forward navigation.
		initialLatestSeenThreadId,
		// `channelView` should be determined on the initial render,
		// so that `VirtualScroller` state stays the same during Back / Forward navigation.
		// Otherwise, the user could switch it to another view in another tab.
		channelView
	} = useSelector(state => state.channel)

	const dispatch = useDispatch()

	const onSetChannelView = useCallback((view) => {
		dispatch(setChannelView(view))
		dispatch(saveChannelView(view))
	}, [])

	// Update max attachment thumbnail width.
	useUpdateAttachmentThumbnailMaxWidth({ threads })

	const [isSearchBarShown, setSearchBarShown] = useState()

	const onThreadClick = useOnThreadClick()

	const unreadCommentWatcher = useUnreadCommentWatcher()

	const itemComponentProps = useMemo(() => ({
		mode: 'channel',
		hasVoting: channel.features.votes,
		channelId: channel.id,
		dispatch,
		locale,
		onClick: onThreadClick,
		unreadCommentWatcher,
		latestSeenThreadId: channelView === 'new-threads' ? initialLatestSeenThreadId : undefined
	}), [
		channel,
		dispatch,
		locale,
		onThreadClick,
		unreadCommentWatcher,
		initialLatestSeenThreadId,
		channelView
	])

	const toolbar = (
		<Toolbar
			mode="channel"
			dispatch={dispatch}
			isSearchBarShown={isSearchBarShown}
			setSearchBarShown={setSearchBarShown}
			channelView={channelView}
			setChannelView={onSetChannelView}
			className="ChannelPage-menu"/>
	)

	return (
		<section className="ChannelPage Content">
			<header className="ChannelPage-header">
				{React.cloneElement(toolbar, {
					className: 'ChannelPage-headerToolbarSizePlaceholder'
				})}
				<h1 className="ChannelPage-heading">
					<Link
						to="/"
						title={getProvider().title}
						className="ChannelPage-headingLogoLink">
						<ProviderLogo
							className="ChannelPage-headingLogo"/>
					</Link>
					<ChannelUrl
						channelId={channel.id}
						className="ChannelPage-headingId"/>
					{channel.title}
					<ProviderLogo
						className="ChannelPage-headingLogo ChannelPage-headingLogo--spaceEquivalent"/>
				</h1>
				{toolbar}
			</header>
			<CommentsList
				mode="channel"
				initialState={initialVirtualScrollerState}
				setState={setVirtualScrollerState}
				initialScrollPosition={initialScrollPosition}
				setScrollPosition={setScrollPosition}
				items={threads}
				itemComponent={ChannelThread}
				itemComponentProps={itemComponentProps}
				className="ChannelPage-threads"/>
		</section>
	)
	// className="ChannelPage-threads no-margin-collapse"
}

// ChannelPage.propTypes = {
// 	channel: PropTypes.string.isRequired,
// 	threads: PropTypes.arrayOf(PropTypes.object).isRequired,
// 	locale: PropTypes.string.isRequired,
// 	censoredWords: PropTypes.arrayOf(PropTypes.object),
// 	virtualScrollerState: PropTypes.object,
// 	dispatch: PropTypes.func.isRequired
// }

ChannelPage.meta = getChannelPageMeta
ChannelPage.load = loadChannelPage

// This is a workaround for cases when navigating from one channel
// to another channel in order to prevent page state inconsistencies
// while the current channel data is being updated in Redux
// as the "next" page is being loaded.
// https://github.com/4Catalyzer/found/issues/639#issuecomment-567084189
// https://gitlab.com/catamphetamine/react-pages#same-route-navigation
export default function ChannelPageWrapper() {
	const channelId = useSelector(state => state.data.channel.id)
	return <ChannelPage key={channelId}/>
}
ChannelPageWrapper.meta = ChannelPage.meta
ChannelPageWrapper.load = ChannelPage.load