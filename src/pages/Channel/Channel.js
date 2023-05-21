import React, { useMemo, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import classNames from 'classnames'

import {
	setVirtualScrollerState,
	setScrollPosition
} from '../../redux/channel.js'

import getMessages from '../../messages/index.js'

import CommentsList from '../../components/CommentsList.js'
import ChannelHeader from '../../components/ChannelHeader/ChannelHeader.js'

import ChannelThread from './ChannelThread.js'
import { getShowRepliesState } from 'social-components-react/components/CommentTree.js'

import useSetting from '../../hooks/useSetting.js'
import useLocale from '../../hooks/useLocale.js'
import useUserData from '../../hooks/useUserData.js'
import useUnreadCommentWatcher from '../Thread/useUnreadCommentWatcher.js'
import useUpdateAttachmentThumbnailMaxWidth from './useUpdateAttachmentThumbnailMaxWidth.js'
import useOnThreadClick from '../../components/useOnThreadClick.js'

import { getContext } from '../../context.js'

import getChannelPageMeta from './Channel.meta.js'
import loadChannelPage from './Channel.load.js'

import './Channel.css'

function ChannelPage() {
	const channel = useSelector(state => state.data.channel)
	const threads = useSelector(state => state.data.threads)

	const locale = useLocale()

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

	// This "hack" is used to keep rendering the `threads` list
	// which was loaded for the previous `channelView` when switching
	// channel view in the Toolbar.
	const threadsForPreviousChannelView = useRef()

	// Update max attachment thumbnail width.
	useUpdateAttachmentThumbnailMaxWidth({ threads })

	const onThreadClick = useOnThreadClick()

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
			onClick: onThreadClick,
			unreadCommentWatcher,
			latestSeenThreadId: channelView === 'new-threads' ? initialLatestSeenThreadId : undefined
		}
	}), [
		channel,
		dispatch,
		locale,
		onThreadClick,
		unreadCommentWatcher,
		initialLatestSeenThreadId,
		channelView
	])

	const threadsForCurrentChannelView = useMemo(() => {
		return threads
	}, [channelView])

	const onChannelViewWillChange = useCallback(() => {
		threadsForPreviousChannelView.current = threads
	}, [])

	const onChannelViewDidChange = useCallback(() => {
		threadsForPreviousChannelView.current = undefined
	}, [])

	const transformInitialItemState = useCallback((itemState, item) => {
		if (channelView === 'new-comments') {
			// If the thread is not hidden then show its latest comments.
			if (!itemState.hidden) {
				return {
					...itemState,
					...getShowRepliesState(item.comments[0])
				}
			}
		}
		return itemState
	}, [channelView])

	const getColumnsCount = useCallback(() => {
		if (channelView === 'new-threads-tiles') {
			return 3
		}
		return 1
	}, [channelView])

	return (
		<section className={classNames('Content', 'ChannelPage', {
			'ChannelPage--latestComments': channelView === 'new-comments'
		})}>
			<ChannelHeader
				alignTitle="start"
				channelView={channelView}
				onChannelViewWillChange={onChannelViewWillChange}
				onChannelViewDidChange={onChannelViewDidChange}
			/>

			<div className="ChannelPage-commentsListContainer">
				{/* Added `key` property to force a reset of any `<VirtualScroller/>` state
				    when the user changes the current channel's viewing mode. */}
				<CommentsList
					key={channelView}
					mode="channel"
					getColumnsCount={getColumnsCount}
					transformInitialItemState={transformInitialItemState}
					initialState={initialVirtualScrollerState}
					setState={setVirtualScrollerState}
					initialScrollPosition={initialScrollPosition}
					setScrollPosition={setScrollPosition}
					items={threadsForPreviousChannelView.current || threads}
					itemComponent={ChannelThread}
					itemComponentProps={itemComponentProps}
					className={classNames('ChannelPage-threads', `ChannelPage-threads--${channelView}`)}
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
	const {
		userData,
		userSettings,
		dataSource
	} = getContext()

	const useSetting_ = (getter) => useSetting(getter, { useSelector })

	return await loadChannelPage({
		channelId,
		useChannel: () => useSelector(state => state.data.channel),
		dispatch,
		userData,
		userSettings,
		dataSource,
		wasCancelled: () => false,
		censoredWords: useSetting_(settings => settings.censoredWords),
		grammarCorrection: useSetting_(settings => settings.grammarCorrection),
		locale: useSetting_(settings => settings.locale),
		autoSuggestFavoriteChannels: useSetting_(settings => settings.autoSuggestFavoriteChannels),
		channelView: useSetting_(settings => settings.channelView)
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