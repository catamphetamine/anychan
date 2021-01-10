import React, { useState, useRef, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { useSelector, useDispatch } from 'react-redux'

import {
	setVirtualScrollerState,
	setScrollPosition
} from '../../redux/thread'

import getMessages from '../../messages'

import InReplyToModal from '../../components/InReplyToModal'
import CommentsList from '../../components/CommentsList'
import ShowPrevious from '../../components/ShowPrevious'

import ThreadComment from './ThreadComment'
import ThreadPageHeader from './ThreadPageHeader'
import AutoUpdate from './AutoUpdate'
import InfoBanner from './InfoBanner'
import PostForm from '../../components/PostForm'

import useFromIndex from './useFromIndex'
import useExpandAttachments from './useExpandAttachments'
import useTrackedThread from './useTrackedThread'
import useThreadNavigation from './useThreadNavigation'
import useSlideshow from './useSlideshow'
import useShowCommentOnSameThreadUrlNavigation from './useShowCommentOnSameThreadUrlNavigation'
import useGetCommentById from './useGetCommentById'
import useDownloadThread from './useDownloadThread'
import useUnreadCommentWatcher from './useUnreadCommentWatcher'
import useUpdateAttachmentThumbnailMaxWidth from './useUpdateAttachmentThumbnailMaxWidth'
import useRenderComment from './useRenderComment'
import usePostComment from './usePostComment'
import useGoToComment from './useGoToComment'
import useGoBack from './useGoBack'

import getThreadPageMeta from './getThreadPageMeta'
import loadThreadPage from './loadThreadPage'

import GhostIcon from 'webapp-frontend/assets/images/icons/ghost-neutral-cross-eyes-mouth-tongue.svg'
import LockIcon from 'webapp-frontend/assets/images/icons/lock.svg'
import SinkingBoatIcon from '../../../assets/images/icons/sinking-boat.svg'

import './Thread.css'

function ThreadPage() {
	const [isSearchBarShown, setSearchBarShown] = useState()
	const [searchQuery, setSearchQuery] = useState()

	// Redux state.
	const channel = useSelector(({ data }) => data.channel)
	const thread = useSelector(({ data }) => data.thread)
	const locale = useSelector(({ settings }) => settings.settings.locale)

	const dispatch = useDispatch()

	const unreadCommentWatcher = useUnreadCommentWatcher()

	const virtualScroller = useRef()
	const initialVirtualScrollerState = useSelector(({ thread }) => thread.virtualScrollerState)
	const initialScrollPosition = useSelector(({ thread }) => thread.scrollPosition)

	// "Expand attachments".
	const [areAttachmentsExpanded, setAttachmentsExpanded] = useExpandAttachments()

	// Update max attachment thumbnail width.
	useUpdateAttachmentThumbnailMaxWidth({
		comments: thread.comments
	})

	const [isThreadTracked, setThreadTracked] = useTrackedThread({
		channel,
		thread
	})

	// First shown comment index.
	const [
		fromIndex,
		setNewFromIndex,
		setNewFromIndexPreservingScrollPosition,
		preserveScrollPositionOnPrependItems,
		isInitialFromIndex,
		initialLatestReadCommentIndex,
		initiallyShowCommentsFromTheLatestReadOne
	] = useFromIndex({
		thread,
		location
	})

	const [
		openSlideshow
	] = useSlideshow({
		thread,
		fromIndex,
		setNewFromIndex
	})

	const shownComments = useMemo(
		() => thread.comments.slice(fromIndex),
		[thread, fromIndex]
	)

	useShowCommentOnSameThreadUrlNavigation({
		channel,
		thread,
		showComment: (commentId) => {
			const index = thread.comments.findIndex(_ => _.id === commentId)
			if (index >= 0) {
				setNewFromIndex(index)
			}
		}
	})

	const getCommentById  = useGetCommentById({
		thread
	})

	const onDownloadThread = useDownloadThread({
		thread,
		getCommentById
	})

	const [
		threadNavigationHistory,
		onNavigateToComment,
		onGoBackInThreadNavigationHistory,
		isThreadHistoryModalShown,
		hideThreadHistoryModal
	] = useThreadNavigation({
		// `thread` object "reference" changes on every auto-update.
		// The `getCommentById()` function is implemented in such a way
		// that its "reference" doesn't change when `thread` object
		// "reference" changes. This is done so that `onNavigateToComment()`
		// function "reference" doesn't change too, because it's used in
		// `itemComponentProps`. Otherwise, `itemComponentProps` would change,
		// and then `<VirtualScroller/>` would re-render all comments on
		// thread auto-update (instead of updating just the comments that changed).
		getCommentById,
		locale
	})

	// `renderComment()` is called whenever there's a "parent" comment
	// whose `content` did change (for example, when a YouTube video link got loaded),
	// and so such "parent" comment update should trigger a "re-render" of all comments
	// that quote this "parent" comment, because those quotes have been re-generated.
	// `renderComment(commentId)` does that: re-renders a comment by its ID.
	const renderComment = useRenderComment({
		virtualScroller
	})

	// Returns `true` if the comment has been "previously read".
	// "Previously read" means that it has been read on the previous
	// view of this thread's page.
	const isPreviouslyRead = useCallback((commentId) => {
		// Don't mark comments as "previously read" when the user starts
		// looking through "previous comments" via "Show previous comments":
		// in that case, `isInitialFromIndex` will be `false`.
		if (initiallyShowCommentsFromTheLatestReadOne && isInitialFromIndex) {
			// Don't show the "original comment" as "previously read"
			// because it doesn't look pleasing.
			if (initialLatestReadCommentIndex === 0) {
				return false
			}
			// Because removed comments are retained during thread auto-update,
			// the initially loaded `thread` is fine for this function's logic,
			// even after the thread has been auto-updated, and there's a new
			// `thread` object with a new `comments` list.
			// And if it refreshes the reference to the `thread` object due to
			// some "dependency" change, then it'll also continue to behave correctly.
			return commentId <= thread.comments[initialLatestReadCommentIndex].id
		}
	}, [
		initiallyShowCommentsFromTheLatestReadOne,
		isInitialFromIndex,
		initialLatestReadCommentIndex
	])

	const itemComponentProps = useMemo(() => ({
		renderComment,
		getCommentById,
		mode: 'thread',
		channelId: channel.id,
		hasVoting: channel.hasVoting,
		channelIsNotSafeForWork: channel.isNotSafeForWork,
		showReplyAction: true,
		// `thread.expired: true` flag is set on thread page by `<AutoUpdate/>`
		// when a thread expires during auto-update.
		threadExpired: thread.expired,
		threadIsLocked: thread.isLocked,
		threadIsRolling: thread.isRolling,
		threadId: thread.id,
		dispatch,
		locale,
		unreadCommentWatcher,
		expandPostLinkBlockQuotes: false,
		expandAttachments: areAttachmentsExpanded,
		onShowComment: onNavigateToComment,
		isPreviouslyRead,
		onDownloadThread
	}), [
		// The dependencies list should be such that
		// comments aren't re-rendered when they don't need to.
		channel,
		thread.expired,
		thread.isLocked,
		thread.isRolling,
		thread.id,
		areAttachmentsExpanded,
		renderComment,
		getCommentById,
		isPreviouslyRead,
		onDownloadThread,
		dispatch,
		locale,
		unreadCommentWatcher,
		onNavigateToComment
	])

	const onPostComment = usePostComment()

	const onGoBack = useGoBack()

	const onGoToComment = useGoToComment({
		thread,
		setNewFromIndex
	})

	const onShowAll = useCallback(() => {
		setNewFromIndex(0)
	}, [
		setNewFromIndex
	])

	return (
		<section className={classNames('ThreadPage', 'Content')}>
			<ThreadPageHeader
				channel={channel}
				thread={thread}
				onGoBack={onGoBack}
				locale={locale}
				openSlideshow={openSlideshow}
				getCommentById={getCommentById}
				isThreadTracked={isThreadTracked}
				setThreadTracked={setThreadTracked}
				isSearchBarShown={isSearchBarShown}
				setSearchBarShown={setSearchBarShown}
				areAttachmentsExpanded={areAttachmentsExpanded}
				setAttachmentsExpanded={setAttachmentsExpanded}/>
			{fromIndex > 0 &&
				<ShowPrevious
					fromIndex={fromIndex}
					setFromIndex={setNewFromIndexPreservingScrollPosition}
					items={thread.comments}
					onShowAll={onShowAll}
					locale={locale}/>
			}
			<div className="ThreadPage-commentsContainer">
				{searchQuery &&
					<CommentsList
						key="searchResults"
						mode="thread"/>
				}
				{shownComments.length > 0 && !searchQuery &&
					<CommentsList
						key="comments"
						ref={virtualScroller}
						mode="thread"
						initialState={initialVirtualScrollerState}
						setState={setVirtualScrollerState}
						initialScrollPosition={initialScrollPosition}
						setScrollPosition={setScrollPosition}
						items={shownComments}
						itemComponent={ThreadComment}
						itemComponentProps={itemComponentProps}
						getCommentById={getCommentById}
						preserveScrollPositionOnPrependItems={preserveScrollPositionOnPrependItems}
						preserveScrollPositionOfTheBottomOfTheListOnMount={isInitialFromIndex && fromIndex === thread.comments.length}
						className={classNames('ThreadPage-comments', {
							// 'ThreadPage-comments--fromTheStart': fromIndex === 0
						})}/>
				}
				{/*noNewComments &&
					<p className="ThreadPage-noNewComments">
						{getMessages(locale).noNewComments}
					</p>
				*/}
			</div>
			{!searchQuery && !(thread.isLocked || thread.expired) &&
				<React.Fragment>
					<AutoUpdate
						autoStart={initiallyShowCommentsFromTheLatestReadOne && initialLatestReadCommentIndex === thread.comments.length - 1}/>
					{/*<PostForm onSubmit={onPostComment}/>*/}
					{thread.isBumpLimitReached &&
						<InfoBanner
							Icon={SinkingBoatIcon}>
							{getMessages(locale).threadBumpLimitReached}
						</InfoBanner>
					}
				</React.Fragment>
			}
			{!searchQuery && thread.isLocked &&
				<InfoBanner
					Icon={LockIcon}>
					{getMessages(locale).threadIsLocked}
				</InfoBanner>
			}
			{!searchQuery && thread.expired &&
				<InfoBanner
					Icon={GhostIcon}>
					{getMessages(locale).threadExpired}
				</InfoBanner>
			}
			{threadNavigationHistory.length > 0 &&
				<InReplyToModal
					channel={channel}
					thread={thread}
					isOpen={isThreadHistoryModalShown}
					onClose={hideThreadHistoryModal}
					onGoBack={onGoBackInThreadNavigationHistory}
					history={threadNavigationHistory}
					onShowComment={onNavigateToComment}
					onGoToComment={onGoToComment}/>
			}
		</section>
	)
}

ThreadPage.meta = getThreadPageMeta
ThreadPage.load = loadThreadPage

// This is a workaround for cases when navigating from one thread
// to another thread in order to prevent page state inconsistencies
// while the current thread data is being updated in Redux
// as the "next" page is being loaded.
// https://github.com/4Catalyzer/found/issues/639#issuecomment-567650811
// https://gitlab.com/catamphetamine/react-pages#same-route-navigation
export default function ThreadPageWrapper() {
	const channelId = useSelector(({ data }) => data.channel.id)
	const threadId = useSelector(({ data }) => data.thread.id)
	return <ThreadPage key={`${channelId}/${threadId}`}/>
}
ThreadPageWrapper.meta = ThreadPage.meta
ThreadPageWrapper.load = ThreadPage.load