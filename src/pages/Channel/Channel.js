import React, { useState, useMemo, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import classNames from 'classnames'
import { getViewportWidthWithScrollbar } from 'web-browser-window'
import { useSelectorForLocation } from 'react-pages'

import {
	setVirtualScrollerState,
	setSearchResultsState,
	setScrollPosition
} from '../../redux/channel.js'

import getMessages from '../../messages/index.js'

import CommentsList from '../../components/CommentsList.js'
import ChannelHeader from '../../components/ChannelHeader/ChannelHeader.js'
import PinnedThreads from '../../components/PinnedThreads/PinnedThreads.js'

import ChannelCreateThreadButton from './ChannelCreateThreadButton.js'
import ChannelThread from './ChannelThread.js'
import { getShowRepliesState } from 'social-components-react/components/CommentTree.js'

import useSetting from '../../hooks/useSetting.js'
import useLocale from '../../hooks/useLocale.js'
import useMessages from '../../hooks/useMessages.js'
import useUserData from '../../hooks/useUserData.js'
import useUnreadCommentWatcher from '../Thread/useUnreadCommentWatcher.js'
import useUpdateAttachmentThumbnailMaxWidth from './useUpdateAttachmentThumbnailMaxWidth.js'
import useOnThreadClick from '../../components/useOnThreadClick.js'

import { getContext } from '../../context.js'

import getChannelPageMeta from './Channel.meta.js'
import useLoadChannelPage from '../../hooks/useLoadChannelPage.js'

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

	const {
		virtualScrollerState: initialVirtualScrollerState,
		scrollPosition: initialScrollPosition,

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
			// Old cached board objects don't have a `.features` sub-object.
			// (Before early 2023).
			hasVoting: channel.features && channel.features.votes,
			channelId: channel.id,
			dispatch,
			locale,
			onClick: onThreadClick,
			unreadCommentWatcher,
			latestSeenThreadId: channelLayout === 'threadsList' ? initialLatestSeenThreadId : undefined
		}
	}), [
		channel,
		dispatch,
		locale,
		onThreadClick,
		unreadCommentWatcher,
		initialLatestSeenThreadId,
		channelLayout,
		channelSorting
	])

	const transformInitialItemState = useCallback((itemState, item) => {
		if (channelLayout === 'threadsListWithLatestComments') {
			// If the thread is not hidden then show its latest comments.
			if (!itemState.hidden) {
				return {
					...itemState,
					...getShowRepliesState(item.comments[0])
				}
			}
		}
		return itemState
	}, [channelLayout])

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
	const [searchResultsId, setSearchResultsId] = useState(initialSearchResultsState ? initialSearchResultsState.searchResultsId : undefined)
	const [searchResultsQuery, setSearchResultsQuery] = useState(initialSearchResultsState ? initialSearchResultsState.searchQuery : undefined)

	const onSearchResults = useCallback((searchResults, { query, finished, duration }) => {
		const searchResultsId = getNextSearchResultsId()
		setSearchResults(searchResults)
		setSearchResultsId(searchResultsId)
		setSearchResultsQuery(query)
		dispatch(setSearchResultsState({
			searchResults,
			searchResultsId,
			searchQuery: query
		}))
		// Reset `virtual-scroller` state whenever the user changes search input value.
		// Otherwise, there'd be a bug:
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

	return (
		<section className={classNames('Content', 'ChannelPage', {
			'ChannelPage--latestComments': channelLayout === 'threadsListWithLatestComments'
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

			<ChannelCreateThreadButton
				channelId={channel.id}
				channelIsNotSafeForWork={channel.notSafeForWork}
			/>

			<div className="ChannelPage-commentsListContainer">
				{/*<PinnedThreads
					threads={threads}
				/>*/}

				{searchResultsQuery && searchResults.length === 0 &&
					<div className="ChannelPage-nothingFound">
						{messages.noSearchResults}
					</div>
				}

				{/* Added `key` property to force a reset of any `<VirtualScroller/>` state
				    when the user changes the current channel's viewing mode. */}
				<CommentsList
					key={searchResultsQuery ? 'searchResults:' + searchResultsId : channelLayout + '_' + channelSorting}
					mode="channel"
					getColumnsCount={getColumnsCount}
					transformInitialItemState={transformInitialItemState}
					initialState={initialVirtualScrollerState}
					setState={setVirtualScrollerState}
					initialScrollPosition={initialScrollPosition}
					setScrollPosition={setScrollPosition}
					items={searchResultsQuery ? searchResults : threads}
					itemComponent={ChannelThread}
					itemComponentProps={itemComponentProps}
					className={classNames('ChannelPage-threads', {
						'ChannelPage-threads--tiles': channelLayout === 'threadsTiles'
					})}
				/>
			</div>
		</section>
	)
}

ChannelPage.meta = getChannelPageMeta

ChannelPage.load = async ({
	useSelector,
	dispatch,
	params: { channelId }
}) => {
	const loadChannelPage = useLoadChannelPage({
		useCallback: (func) => func,
		useSelector,
		useDispatch: () => dispatch,
		useUserData: () => getContext().userData,
		useUserSettings: () => getContext().userSettings,
		useDataSource: () => getContext().dataSource
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

		// Reset `virtual-scroller` state whenever the user changes search input value.
		// Otherwise, there'd be a bug:
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

// "Safe" refers to the ability of JavaScript to represent integers exactly
// and to correctly compare them.
const MAX_SAFE_INTEGER = 9007199254740991

let searchResultsId = 0
function getNextSearchResultsId() {
	if (searchResultsId === MAX_SAFE_INTEGER) {
		searchResultsId = 0
	}
	searchResultsId++
	return searchResultsId
}