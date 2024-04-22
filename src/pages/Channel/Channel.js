import React, { useState, useMemo, useRef, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import classNames from 'classnames'
import { getViewportWidthWithScrollbar } from 'web-browser-window'
import { useSelectorForLocation } from 'react-pages'
import { sortThreadsWithPinnedOnTop } from 'imageboard'

import {
	setVirtualScrollerState,
	setSearchResultsState
} from '../../redux/channel.js'

import CommentsList from '../../components/CommentsList.js'
import ChannelHeader from '../../components/ChannelHeader/ChannelHeader.js'

import ChannelPageTop from './ChannelPageTop.js'
import ChannelThread from './ChannelThread.js'

import useLocale from '../../hooks/useLocale.js'
import useMessages from '../../hooks/useMessages.js'
import useBackground from '../../hooks/useBackground.js'
import useUnreadCommentWatcher from '../Thread/useUnreadCommentWatcher.js'
import useUpdateAttachmentThumbnailMaxWidth from './useUpdateAttachmentThumbnailMaxWidth.js'
import useTransformCommentListItemInitialState from './useTransformCommentListItemInitialState.js'
import useOnThreadClick from '../../components/useOnThreadClick.js'

import getChannelPageMeta from './Channel.meta.js'
import useLoadChannelPage from '../../hooks/useLoadChannelPage.js'
import { ChannelLayoutContext } from './useChannelLayout.js'

import useLayoutEffectSkipMount from 'frontend-lib/hooks/useLayoutEffectSkipMount.js'

import './Channel.css'

export default function ChannelPage() {
	// Using `useSelectorForLocation()` instead of `useSelector()` here
	// as a workaround for cases when navigating from one channel
	// to another channel in order to prevent page state inconsistencies
	// while the current channel data is being updated in Redux
	// as the "next" page is being loaded.
	// https://github.com/4Catalyzer/found/issues/639#issuecomment-567084189
	// https://gitlab.com/catamphetamine/react-pages#same-route-navigation
	const channel = useSelectorForLocation(state => state.data.channel)
	const latestLoadedThreads = useSelectorForLocation(state => state.data.threads)

	const locale = useLocale()
	const messages = useMessages()
	const background = useBackground()

	const {
		virtualScrollerState: initialVirtualScrollerState,

		searchResultsState: initialSearchResultsState,

		// `latestSeenThreadId` should be determined on the initial render,
		// and then it shouldn't change, so that `VirtualScroller` state stays the same
		// during Back / Forward navigation.
		initialLatestSeenThreadId,

		// `channelLayout` / `channelSorting` should be cached at the initial render.
		// Otherwise, if it was read from its latest value from `state.settings`,
		// it could result in an incorrect behavior of `<VirtualScroller/>` when navigating "Back".
		// In that case, the cached list item sizes would correspond to the old
		// `channelLayout` / `channelSorting` while the user might have changed the
		// `channelLayout` / `channelSorting` to some other value in some other tab
		// since the channel page has initially been rendered.
		// So after "Back" navigation, the page should be restored to as it was before navigating from it,
		// and that would include the `channelLayout` / `channelSorting` setting value,
		// and that's why it gets saved in `state.channel` for this particular page
		// rather than just in `state.settings`.
		channelLayout,
		channelSorting
	} = useSelectorForLocation(state => state.channel)

	const dispatch = useDispatch()

	const {
		threads,
		onChannelViewWillChange,
		onChannelViewDidChange
	} = useThreadsForChannelView(latestLoadedThreads)

	// Update max attachment thumbnail width.
	useUpdateAttachmentThumbnailMaxWidth({ threads })

	const onThreadClick = useOnThreadClick()

	const unreadCommentWatcher = useUnreadCommentWatcher()

	const itemComponentProps = useMemo(() => ({
		channelLayout,
		channelSorting,
		commonProps: {
			mode: 'channel',
			// Previously, before early 2023, the cached list of `channel` objects
			// in `localStorage` didn't contain a `.features` sub-object in the list items.
			// So because of legacy compatibility, here's a check that `channel.features` property exists.
			hasVoting: channel.features && channel.features.votes,
			channelId: channel.id,
			locale,
			messages,
			onClick: onThreadClick,
			unreadCommentWatcher,
			latestSeenThreadId: channelLayout === 'threadsList' ? initialLatestSeenThreadId : undefined
		}
	}), [
		channel,
		locale,
		messages,
		onThreadClick,
		unreadCommentWatcher,
		initialLatestSeenThreadId,
		channelLayout,
		channelSorting
	])

	const transformCommentListItemInitialState = useTransformCommentListItemInitialState({
		channelLayout
	})

	const getColumnsCount = useCallback(() => {
		if (channelLayout === 'threadsTiles') {
			const style = getComputedStyle(document.documentElement)

			const maxWidthXs = parseInt(style.getPropertyValue('--Window-maxWidth--xs'))
			const maxWidthS = parseInt(style.getPropertyValue('--Window-maxWidth--s'))
			const maxWidthM = parseInt(style.getPropertyValue('--Window-maxWidth--m'))
			const maxWidthL = parseInt(style.getPropertyValue('--Window-maxWidth--l'))
			const maxWidthXl = parseInt(style.getPropertyValue('--Window-maxWidth--xl'))

		  // These values must be equal to those in `.ChannelPage-threads--tiles`
		  // in `pages/Channel/Channel.css`.
		  const getColumnsCount = (width) => {
				if (width <= maxWidthXs) {
					return 1
				} else if (width <= maxWidthS) {
					return 2
				} else if (width <= maxWidthXl) {
					return 3
				} else {
					return 4
				}
			}

			return getColumnsCount(getViewportWidthWithScrollbar())
		}
		return 1
	}, [channelLayout])

	// Scroll to the top of the page when changing channel layout or channel sorting.
	useLayoutEffectSkipMount(() => {
		window.scrollTo(0, 0)
	}, [
		channelLayout,
		channelSorting
	])

	const [searchQuery, setSearchQuery] = useState(initialSearchResultsState ? initialSearchResultsState.searchQuery : undefined)
	const [searchResults, setSearchResults] = useState(initialSearchResultsState ? initialSearchResultsState.searchResults : undefined)
	const [searchResultsQuery, setSearchResultsQuery] = useState(initialSearchResultsState ? initialSearchResultsState.searchQuery : undefined)

	const onSearchResults = useCallback((searchResults, { query, finished, duration }) => {
		setSearchResults(searchResults)
		setSearchResultsQuery(query)
		dispatch(setSearchResultsState({
			searchResults,
			searchQuery: query
		}))
		// Reset `virtual-scroller` state whenever the user changes search input value.
		// That's because the old `initialVirtualScrollerState` is no longer valid
		// because it was calculated for the old set of `items`, and the `items` are now different.
		// If the old `initialVirtualScrollerState` wasn't cleared here
		// and the user navigates to some other page and then goes "instant back" to this page,
		// this page would get mounted again and the `<VirtualScroller/>` would get mounted with it,
		// and the old `initialVirtualScrollerState` would get applied but the `items` would already
		// be different, which would result in an inconsistency bug:
		// * User goes to channel page.
		// * User scrolls down, etc.
		// * User enters something in the search input.
		// * The channel page shows search results.
		// * The user clicks on a thread and goes to the thread page.
		// * The user clicks "Back" button and returns to the channel page.
		// * `VirtualScroller` restores the `initialVirtualScrollerState` and shows the search results.
		// * The user clears the search input.
		// * `VirtualScroller` remounts because of the `key` property.
		// * When `VirtualScroller` mounts, it reads `initialVirtualScrollerState` and applies it.
		// * The result is: `VirtualScroller` shouldn't have restored any previous state, but it did.
		dispatch(setVirtualScrollerState(undefined))
	}, [])

	const pinnedThreads = useMemo(() => {
		return sortThreadsWithPinnedOnTop(threads.filter(_ => _.pinned))
	}, [threads])

	return (
		<section className={classNames('Content', 'ChannelPage', {
			'ChannelPage--latestComments': channelLayout === 'threadsListWithLatestComments',
			'ChannelPage--onBackground': background
		})}>
			<ChannelHeader
				threads={threads}
				searchQuery={searchQuery}
				onSearchQueryChange={setSearchQuery}
				onSearchResults={onSearchResults}
				alignTitle="start"
				channelLayout={channelLayout}
				channelSorting={channelSorting}
				canChangeChannelLayout
				canChangeChannelSorting
				onChannelViewWillChange={onChannelViewWillChange}
				onChannelViewDidChange={onChannelViewDidChange}
			/>

			<ChannelPageTop
				channel={channel}
				pinnedThreads={searchResultsQuery ? undefined : pinnedThreads}
				threadComponentProps={itemComponentProps}
			/>

			<div className="ChannelPage-commentsListContainer">
				{searchResultsQuery && searchResults.length === 0 &&
					<div className="ChannelPage-nothingFound">
						<span className="ChannelPage-nothingFoundText">
							{messages.noSearchResults}
						</span>
					</div>
				}

				{/* Added `key` property to force a reset of any `<VirtualScroller/>` state
				    when the user changes the current channel's layout.
				    Why was that done? Maybe in some future someone will remove
				    re-loading of the `threads` list when switching between different layouts,
				    and in that case the `threads` list will stay the same when doing the switching,
				    meaning that `virtual-scroller` would retain item states and item heights
				    and it would be unexpected for it to see those list items start rendering differently.
				    But currently, when switching between different layouts and sortings,
				    `threads` list gets re-fetched from the server, and `virtual-scroller`
				    correctly resets item states and heights when it receives a completely new set of items,
				    so with the currently implementation the `key` is not required and could be removed. */}
				<ChannelLayoutContext.Provider value={channelLayout}>
					<CommentsList
						key={channelLayout}
						mode="channel"
						getColumnsCount={getColumnsCount}
						transformInitialItemState={transformCommentListItemInitialState}
						initialState={initialVirtualScrollerState}
						setState={setVirtualScrollerState}
						items={searchResultsQuery ? searchResults : threads}
						itemComponent={ChannelThread}
						itemComponentProps={itemComponentProps}
						className={classNames('ChannelPage-threads', {
							'ChannelPage-threads--tiles': channelLayout === 'threadsTiles'
						})}
					/>
				</ChannelLayoutContext.Provider>
			</div>
		</section>
	)
}

ChannelPage.meta = getChannelPageMeta

ChannelPage.load = async ({
	useSelector,
	dispatch,
	params: { channelId },
	context
}) => {
	const loadChannelPage = useLoadChannelPage({
		useCallback: (func) => func,
		useSelector,
		useDispatch: () => dispatch,
		useUserData: () => context.userData,
		useUserSettings: () => context.userSettings,
		useDataSource: () => context.dataSource
	})

	await loadChannelPage({ channelId })
}

function useThreadsForChannelView(latestLoadedThreads) {
	// This "hack" is used to keep rendering the `threads` list
	// which was loaded for the previous `channelLayout` / `channelSorting`
	// when switching channel view in the Toolbar.
	const threadsForPreviousChannelView = useRef()

	// Until `channelLayout` / `channelSorting` have been updated in Redux state,
	// it's gonna use the list of threads for the previous values of those two.
	// When `channelLayout` / `channelSorting` have been updated in Redux state,
	// `onChannelViewDidChange()` is called and the "previous" value gets cleared.
	const threads = threadsForPreviousChannelView.current || latestLoadedThreads

	const onChannelViewWillChange = useCallback(() => {
		threadsForPreviousChannelView.current = latestLoadedThreads

		// Reset `virtual-scroller` state whenever the user changes channel view.
		// That's because the old `initialVirtualScrollerState` is no longer valid
		// because it was calculated for the old set of `items`, and the `items` are now different.
		// If the old `initialVirtualScrollerState` wasn't cleared here
		// and the user navigates to some other page and then goes "instant back" to this page,
		// this page would get mounted again and the `<VirtualScroller/>` would get mounted with it,
		// and the old `initialVirtualScrollerState` would get applied but the `items` would already
		// be different, which would result in an inconsistency bug.
		// And even without the user navigating anywhere, `<VirtualScroller/>` would still re-mount
		// because its `key` depends on `channelView` so that `key` would change whenever `channelView` does.
		// The bug would manifest in the following way:
		// * User goes to channel page.
		// * User scrolls down, etc.
		// * User enters something in the search input.
		// * The channel page shows search results.
		// * The user clicks on a thread and goes to the thread page.
		// * The user clicks "Back" button and returns to the channel page.
		// * `VirtualScroller` restores the `initialVirtualScrollerState` and shows the search results.
		// * The user clears the search input.
		// * `VirtualScroller` remounts because of the `key` property.
		// * When `VirtualScroller` mounts, it reads `initialVirtualScrollerState` and applies it.
		// * The result is: `VirtualScroller` shouldn't have restored any previous state, but it did.
		dispatch(setVirtualScrollerState(undefined))
	}, [])

	const onChannelViewDidChange = useCallback(() => {
		threadsForPreviousChannelView.current = undefined
	}, [])

	return {
		threads,
		onChannelViewWillChange,
		onChannelViewDidChange
	}
}