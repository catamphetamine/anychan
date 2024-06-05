import type { CommentId, ThreadId, ChannelId, Thread, GetCommentById, PageLoadFunction } from '@/types'
import type { VirtualScrollerItemComponentProps } from './types.js'

import React, { useState, useMemo, useRef, useEffect, useLayoutEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import classNames from 'classnames'
import { getViewportWidthWithScrollbar } from 'web-browser-window'
import { useAfterRenderedThisPage, useBeforeRenderAnotherPage } from 'react-pages'
import { sortThreadsWithPinnedOnTop } from 'imageboard'

import {
	setVirtualScrollerState,
	setSearchResultsState
} from '../../redux/channelPage.js'

import { ThreadsListOnChannelPage as CommentsList } from '../../components/CommentsList.js'
import ChannelHeader from '../../components/ChannelHeader/ChannelHeader.js'

import ChannelPageTop from './ChannelPageTop.js'
import ChannelThread from './ChannelThread.js'

import useLocale from '../../hooks/useLocale.js'
import useMessages from '../../hooks/useMessages.js'
import useSetting from '../../hooks/useSetting.js'
import useUserData from '../../hooks/useUserData.js'
import useBackground from '../../hooks/useBackground.js'
import useLoadChannelPage from '../../hooks/useLoadChannelPage.js'
import usePageStateSelector from '../../hooks/usePageStateSelector.js'
import useUnreadCommentWatcher from '../Thread/useUnreadCommentWatcher.js'
import useUpdateAttachmentThumbnailMaxWidth from './useUpdateAttachmentThumbnailMaxWidth.js'
import useTransformCommentListItemInitialState from './useTransformCommentListItemInitialState.js'
import useGetCommentById from './useGetCommentById.js'
import useOnThreadClick from '../../components/useOnThreadClick.js'

import onCommentOwnershipStatusChange_ from '../../utility/comment/onCommentOwnershipStatusChange.js'

import { addFavoriteChannel } from '../../redux/favoriteChannels.js'

import getChannelPageMeta from './Channel.meta.js'
import { ChannelLayoutContext } from './useChannelLayout.js'

import useLayoutEffectSkipMount from 'frontend-lib/hooks/useLayoutEffectSkipMount.js'

import './Channel.css'

export default function ChannelPage({
	restoreState = true
}: ChannelPageProps) {
	// Using `usePageStateSelector()` instead of `useSelector()` here
	// as a workaround for cases when navigating from one channel
	// to another channel in order to prevent page state inconsistencies
	// while the current channel data is being updated in Redux
	// as the "next" page is being loaded.
	// https://github.com/4Catalyzer/found/issues/639#issuecomment-567084189
	// https://gitlab.com/catamphetamine/react-pages#same-route-navigation

	const channel = usePageStateSelector('channel', state => state.channel.channel)
	const latestLoadedThreads = usePageStateSelector('channel', state => state.channel.threads)

	const locale = useLocale()
	const messages = useMessages()
	const background = useBackground()
	const userData = useUserData()
	const dispatch = useDispatch()


	const autoSuggestFavoriteChannels = useSetting(settings => settings.autoSuggestFavoriteChannels)

	// When restoring channel page state, scroll position has to be restored first.
	// After scroll position is restored, `<VirtualScroller/>` can be restored too.
	const [readyToStartVirtualScroller, setReadyToStartVirtualScroller] = useState(!restoreState)

	useEffect(() => {
		if (autoSuggestFavoriteChannels) {
			if (channel) {
				dispatch(addFavoriteChannel({
					channel: {
						id: channel.id,
						title: channel.title
					},
					userData
				}))
			}
		}
	}, [])

	useAfterRenderedThisPage(() => {
		setReadyToStartVirtualScroller(true)
	})

	const initialVirtualScrollerState = usePageStateSelector('channelPage', state => state.channelPage.virtualScrollerState)
	const initialSearchResultsState = usePageStateSelector('channelPage', state => state.channelPage.searchResultsState)

	// `latestSeenThreadId` should be determined on the initial render,
	// and then it shouldn't change, so that `VirtualScroller` state stays the same
	// during Back / Forward navigation.
	//
	// Otherwise, when "instantly" navigating "Back", the former "latest seen" thread
	// would potentially no longer be such, resulting in the corresponding `VirtualScroller`
	// item height to unexpectedly change because `{messages.previouslySeenThreads}` subheading
	// is no longer rendered at the top of that item in the list, and is instead now rendered
	// at the top of some other item in the list, resulting in that item's height to also
	// change unexpectedly, resulting in a perceived "jump of content".
	//
	const initialLatestSeenThreadId = usePageStateSelector('channelPage', state => state.channelPage.initialLatestSeenThreadId)

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
	const channelLayout = usePageStateSelector('channelPage', state => state.channelPage.channelLayout)
	const channelSorting = usePageStateSelector('channelPage', state => state.channelPage.channelSorting)

	const {
		threads,
		onChannelViewWillChange,
		onChannelViewDidChange
	} = useThreadsForChannelView(latestLoadedThreads)

	// `getCommentById` reference shouldn't change, otherwise
	// `onItemInitialRender` property of `<VirtualScroller/>` would change too,
	// and `<VirtualScroller/>` doesn't support handling changes of such properties.
	const getCommentById = useGetCommentById({ threads })

	// Update max attachment thumbnail width.
	useUpdateAttachmentThumbnailMaxWidth({ threads })

	const onThreadClick = useOnThreadClick()

	const unreadCommentWatcher = useUnreadCommentWatcher()

	const itemComponentProps: VirtualScrollerItemComponentProps = useMemo(() => ({
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
			// Only show "Previously Read Threads:" subtitle in "threads list" layout.
			// For example, it shouldn't be shown in "threads tiles" layout because it doesn't fit there.
			latestSeenThreadId: channelLayout === 'threadsList' ? initialLatestSeenThreadId : undefined,
			onCommentOwnershipStatusChange(commentId: CommentId, threadId: ThreadId, channelId: ChannelId, isOwn: boolean) {
				const comment = getCommentById(commentId)
				// Update the ownership status of the comment.
				onCommentOwnershipStatusChange_(comment, threadId, channelId, isOwn, userData)
				// If a comment's ownership status changes, it won't influence any other comment elements on the page
				// because those comment elements correspond do other threads and are therefore independent of this one.
			}
		}
	}), [
		channel,
		locale,
		messages,
		userData,
		onThreadClick,
		unreadCommentWatcher,
		initialLatestSeenThreadId,
		channelLayout,
		channelSorting,
		getCommentById
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
		  const getColumnsCount = (width: number) => {
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

	const onSearchResults = useCallback((
		searchResults: Thread[],
		{
			query,
			finished,
			duration
		}: {
			query: string,
			finished: boolean,
			duration: number
		}
	) => {
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
				channel={channel}
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
						readyToStartVirtualScroller={readyToStartVirtualScroller}
						getColumnsCount={getColumnsCount}
						transformInitialItemState={transformCommentListItemInitialState}
						initialState={initialVirtualScrollerState}
						setStateActionCreator={setVirtualScrollerState}
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

interface ChannelPageProps {
	restoreState?: boolean
}

ChannelPage.propTypes = {
	restoreState: PropTypes.bool
}

ChannelPage.meta = getChannelPageMeta

const load: PageLoadFunction<ChannelPageProps> = async ({
	useSelector,
	dispatch,
	params: { channelId },
	context
}) => {
	const loadChannelPage = useLoadChannelPage({
		useCallback: (func: Function) => func,
		useSelector,
		useDispatch: () => dispatch,
		useUserData: () => context.userData,
		useUserSettings: () => context.userSettings,
		useDataSource: () => context.dataSource,
		useOriginalDomain: () => context.originalDomain
	})

	// `channels` is `undefined` in "offline" mode.
	// `channels` is a just list of "top" channels and is not a complete list of channels.
	const channels = useSelector(state => state.channels.channels)

	await loadChannelPage({
		channel: channels && channels.find(_ => _.id === channelId),
		channelId
	})

	return {
		props: {
			restoreState: false
		}
	}
}

ChannelPage.load = load

function useThreadsForChannelView(latestLoadedThreads: Thread[]) {
	// This "hack" is used to keep rendering the `threads` list
	// which was loaded for the previous `channelLayout` / `channelSorting`
	// when switching channel view in the Toolbar.
	const threadsForPreviousChannelView = useRef<Thread[]>()

	const dispatch = useDispatch()

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