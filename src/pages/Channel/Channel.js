import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react'
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
import useUnreadCommentWatcher from '../Thread/useUnreadCommentWatcher.js'
import useUpdateAttachmentThumbnailMaxWidth from './useUpdateAttachmentThumbnailMaxWidth.js'
import useOnCommentClick from './useOnCommentClick.js'

import { saveChannelView } from '../../redux/settings.js'

import getChannelPageMeta from './getChannelPageMeta.js'
import loadChannelPage from './loadChannelPage.js'

import './Channel.css'

function ChannelPage() {
	const channel = useSelector(state => state.data.channel)
	const threads = useSelector(state => state.data.threads)
	const settings = useSelector(state => state.settings.settings)

	const locale = useLocale()
	const censoredWords = useSelector(state => state.settings.settings.censoredWords)

	const {
		virtualScrollerState: initialVirtualScrollerState,
		scrollPosition: initialScrollPosition,

		// `latestSeenThreadId` should be determined on the initial render,
		// and then it shouldn't change, so that `VirtualScroller` state stays the same
		// during Back / Forward navigation.
		initialLatestSeenThreadId,

		// `channelView` should be cached at the initial render.
		// Otherwise, if it was read from its latest value from `state.settings`,
		// it could result in an incorrect behavior of `<VirtualScroller/>` when navigating "Back".
		// In that case, the cached list item sizes would correspond to the old `channelView`
		// while the user might have changed the `channelView` to some other value in some other tab
		// since the channel page has initially been rendered.
		// So after "Back" navigation, the page should be restored to as it was before navigating from it,
		// and that would include the `channelView` setting value, and that's why it gets saved
		// in `state.channel` for this particular page rather than just in `state.settings`.
		channelView
	} = useSelector(state => state.channel)

	const dispatch = useDispatch()

	// Added `isLoadingChannelView` flag to disable Toolbar channel view selection buttons
	// while it's loading.
	const [isLoadingChannelView, setLoadingChannelView] = useState()

	// Cancel any potential running `loadChannelPage()` function
	// when navigating away from this page.
	const wasUnmounted = useRef()
	useEffect(() => {
		return () => {
			wasUnmounted.current = true
		}
	}, [])

	// This "hack" is used to keep rendering the `threads` list
	// which was loaded for the previous `channelView` when switching
	// channel view in the Toolbar.
	const threadsForPreviousChannelView = useRef()

	const onSetChannelView = useCallback(async (view) => {
		const wasCancelled = () => wasUnmounted.current

		try {
			threadsForPreviousChannelView.current = threads

			setLoadingChannelView(true)

			// Refresh the page.
			await loadChannelPage({
				channelId: channel.id,
				dispatch,
				getCurrentChannel: () => channel,
				settings,
				channelView: view,
				wasCancelled
			})

			if (wasCancelled()) {
				return
			}

			// Set `channelView` on this particular page.
			dispatch(setChannelView(view))

			// Save `channelView` in user's settings.
			dispatch(saveChannelView(view))

			threadsForPreviousChannelView.current = undefined
		} finally {
			setLoadingChannelView(false)
		}
	}, [
		threads,
		dispatch,
		channel,
		settings,
		channelView
	])

	// Update max attachment thumbnail width.
	useUpdateAttachmentThumbnailMaxWidth({ threads })

	const [isSearchBarShown, setSearchBarShown] = useState()

	const onCommentClick = useOnCommentClick()

	const unreadCommentWatcher = useUnreadCommentWatcher()

	const itemComponentProps = useMemo(() => ({
		channelView,
		commonProps: {
			mode: 'channel',
			// Old cached board objects don't have a `.features` sub-object.
			// (Before early 2023).
			hasVoting: channel.features && channel.features.votes,
			channelId: channel.id,
			dispatch,
			locale,
			onClick: onCommentClick,
			unreadCommentWatcher,
			latestSeenThreadId: channelView === 'new-threads' ? initialLatestSeenThreadId : undefined
		}
	}), [
		channel,
		dispatch,
		locale,
		onCommentClick,
		unreadCommentWatcher,
		initialLatestSeenThreadId,
		channelView
	])

	const threadsForCurrentChannelView = useMemo(() => {
		return threads
	}, [channelView])

	const toolbar = (
		<Toolbar
			mode="channel"
			dispatch={dispatch}
			isSearchBarShown={isSearchBarShown}
			setSearchBarShown={setSearchBarShown}
			channelView={channelView}
			setChannelView={onSetChannelView}
			isLoadingChannelView={isLoadingChannelView}
			className="ChannelPage-menu"
		/>
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
							className="ChannelPage-headingLogo"
						/>
					</Link>
					<ChannelUrl
						channelId={channel.id}
						className="ChannelPage-headingId"
					/>
					{channel.title}
					<ProviderLogo
						className="ChannelPage-headingLogo ChannelPage-headingLogo--spaceEquivalent"
					/>
				</h1>
				{toolbar}
			</header>

			{/* Added `key` property to force a reset of any `<VirtualScroller/>` state
			    when the user changes the current channel's viewing mode. */}
			<CommentsList
				key={channelView}
				mode="channel"
				initialState={initialVirtualScrollerState}
				setState={setVirtualScrollerState}
				initialScrollPosition={initialScrollPosition}
				setScrollPosition={setScrollPosition}
				items={threadsForPreviousChannelView.current || threads}
				itemComponent={ChannelThread}
				itemComponentProps={itemComponentProps}
				className="ChannelPage-threads"
			/>
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

ChannelPage.load = async ({ getState, dispatch, params: { channelId } }) => {
	const settings = getState().settings.settings
	return await loadChannelPage({
		channelId,
		dispatch,
		getCurrentChannel: () => getState().data.channel,
		settings,
		channelView: settings.channelView,
		wasCancelled: () => false
	})
}

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