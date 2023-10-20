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
import PinnedThreads from '../../components/PinnedThreads/PinnedThreads.js'

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
import useLoadChannelPage from '../../hooks/useLoadChannelPage.js'

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
	} = useSelector(state => state.channel)

	const dispatch = useDispatch()

	// This "hack" is used to keep rendering the `threads` list
	// which was loaded for the previous `channelLayout` / `channelSorting`
	// when switching channel view in the Toolbar.
	const threadsForPreviousChannelView = useRef()

	const threadsList = threadsForPreviousChannelView.current || threads

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

	const threadsForCurrentChannelView = useMemo(() => {
		return threads
	}, [
		channelLayout,
		channelSorting
	])

	const onChannelViewWillChange = useCallback(() => {
		threadsForPreviousChannelView.current = threads
	}, [])

	const onChannelViewDidChange = useCallback(() => {
		threadsForPreviousChannelView.current = undefined
	}, [])

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
			return 3
		}
		return 1
	}, [channelLayout])

	return (
		<section className={classNames('Content', 'ChannelPage', {
			'ChannelPage--latestComments': channelLayout === 'threadsListWithLatestComments'
		})}>
			<ChannelHeader
				alignTitle="start"
				channelLayout={channelLayout}
				channelSorting={channelSorting}
				canChangeChannelLayout
				canChangeChannelSorting
				onChannelViewWillChange={onChannelViewWillChange}
				onChannelViewDidChange={onChannelViewDidChange}
			/>

			<div className="ChannelPage-commentsListContainer">
				{/*<PinnedThreads
					threads={threadsList}
				/>*/}

				{/* Added `key` property to force a reset of any `<VirtualScroller/>` state
				    when the user changes the current channel's viewing mode. */}
				<CommentsList
					key={channelLayout + '_' + channelSorting}
					mode="channel"
					getColumnsCount={getColumnsCount}
					transformInitialItemState={transformInitialItemState}
					initialState={initialVirtualScrollerState}
					setState={setVirtualScrollerState}
					initialScrollPosition={initialScrollPosition}
					setScrollPosition={setScrollPosition}
					items={threadsList}
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