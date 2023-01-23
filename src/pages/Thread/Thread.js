import React, { useState, useRef, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { useSelector, useDispatch } from 'react-redux'

import getMessages from '../../messages/index.js'
import shouldMinimizeGeneratedPostLinkBlockQuotes from '../../utility/post/shouldMinimizeGeneratedPostLinkBlockQuotes.js'

import useMessages from '../../hooks/useMessages.js'
import useLocale from '../../hooks/useLocale.js'

import InReplyToModal from '../../components/InReplyToModal.js'
import ShowPrevious from '../../components/ShowPrevious.js'

import CommentsList from './CommentsList.js'
import ThreadPageHeader from './ThreadPageHeader.js'
import AutoUpdate from './AutoUpdate.js'
import InfoBanner from './InfoBanner.js'
import PostForm from '../../components/PostForm.js'

import useFromIndex from './useFromIndex.js'
import useExpandAttachments from './useExpandAttachments.js'
import useThreadSubscribed from './useThreadSubscribed.js'
import useThreadNavigation from './useThreadNavigation.js'
import useSlideshow from './useSlideshow.js'
import useShowCommentOnSameThreadUrlNavigation from './useShowCommentOnSameThreadUrlNavigation.js'
import useGetCommentById from './useGetCommentById.js'
import useDownloadThread from './useDownloadThread.js'
import useSubscribeToThread from './useSubscribeToThread.js'
import useUnreadCommentWatcher from './useUnreadCommentWatcher.js'
import useUpdateAttachmentThumbnailMaxWidth from './useUpdateAttachmentThumbnailMaxWidth.js'
import useGoToComment from './useGoToComment.js'
import useGoBackKeyboardControl from './useGoBackKeyboardControl.js'

import getThreadPageMeta from './getThreadPageMeta.js'
import loadThreadPage from './loadThreadPage.js'

import GhostIcon from 'frontend-lib/icons/ghost-neutral-cross-eyes-mouth-tongue.svg'
import BoxIcon from 'frontend-lib/icons/box.svg'
import LockIcon from 'frontend-lib/icons/lock.svg'
import SinkingBoatIcon from '../../../assets/images/icons/sinking-boat.svg'

import './Thread.css'

function ThreadPage() {
	const [isSearchBarShown, setSearchBarShown] = useState()
	const [searchQuery, setSearchQuery] = useState()

	// Redux state.
	const channel = useSelector(state => state.data.channel)
	const thread = useSelector(state => state.data.thread)

	const dispatch = useDispatch()
	const locale = useLocale()
	const messages = useMessages()

	const unreadCommentWatcher = useUnreadCommentWatcher()

	// "Expand attachments".
	const [areAttachmentsExpanded, setAttachmentsExpanded] = useExpandAttachments()

	// Update max attachment thumbnail width.
	useUpdateAttachmentThumbnailMaxWidth({
		comments: thread.comments
	})

	const [isThreadSubscribed, setThreadSubscribed] = useThreadSubscribed({
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

	const {
		openSlideshow
	} = useSlideshow({
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

	const getCommentById = useGetCommentById({
		thread
	})

	const onDownloadThread = useDownloadThread({
		thread,
		getCommentById
	})

	const onSubscribeToThread = useSubscribeToThread({
		thread,
		channel
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
		getCommentById
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

	const onRequestShowCommentFromSameThread = useCallback(({
		commentId,
		fromCommentId
	}) => {
		onNavigateToComment(commentId, fromCommentId)
	}, [onNavigateToComment])

	const itemComponentProps = useMemo(() => ({
		getCommentById,
		mode: 'thread',
		channelId: channel.id,
		// Old cached board objects don't have a `.features` sub-object.
		// (Before early 2023).
		hasVoting: channel.features && channel.features.votes,
		channelIsNotSafeForWork: channel.notSafeForWork,
		canReply: true,
		// `thread.expired: true` flag is set on thread page by `<AutoUpdate/>`
		// when a thread expires during auto-update.
		threadExpired: thread.expired,
		threadIsArchived: thread.archived,
		threadIsLocked: thread.locked,
		threadIsTrimming: thread.trimming,
		threadId: thread.id,
		dispatch,
		locale,
		unreadCommentWatcher,
		expandGeneratedPostLinkBlockQuotes: !shouldMinimizeGeneratedPostLinkBlockQuotes(),
		expandAttachments: areAttachmentsExpanded,
		onRequestShowCommentFromSameThread,
		isPreviouslyRead,
		onDownloadThread,
		onSubscribeToThread
	}), [
		// The dependencies list should be such that
		// comments aren't re-rendered when they don't need to.
		channel,
		thread.expired,
		thread.archived,
		thread.locked,
		thread.trimming,
		thread.id,
		areAttachmentsExpanded,
		getCommentById,
		isPreviouslyRead,
		onDownloadThread,
		onSubscribeToThread,
		dispatch,
		locale,
		unreadCommentWatcher,
		onNavigateToComment
	])

	// Go "back" to thread page on "Backspace".
	useGoBackKeyboardControl({ channelId: channel.id })

	const onGoToComment = useGoToComment({
		thread,
		setNewFromIndex
	})

	const onShowAll = useCallback(() => {
		setNewFromIndex(0)
	}, [
		setNewFromIndex
	])

	const onMount = useMemo(() => {
		const noNewComments = fromIndex === thread.comments.length
		const pageContentHeightBeforeMount = document.documentElement.scrollHeight
		return () => {
			if (noNewComments) {
				// Preserve scroll position on mount.
				const pageContentHeight = document.documentElement.scrollHeight
				window.scrollTo(0, window.scrollY + (pageContentHeight - pageContentHeightBeforeMount))
			}
		}
	}, [])

	return (
		<section className={classNames('ThreadPage', 'Content')}>
			<ThreadPageHeader
				channel={channel}
				thread={thread}
				openSlideshow={openSlideshow}
				getCommentById={getCommentById}
				isThreadSubscribed={isThreadSubscribed}
				setThreadSubscribed={setThreadSubscribed}
				isSearchBarShown={isSearchBarShown}
				setSearchBarShown={setSearchBarShown}
				areAttachmentsExpanded={areAttachmentsExpanded}
				setAttachmentsExpanded={setAttachmentsExpanded}/>
			{fromIndex > 0 &&
				<ShowPrevious
					fromIndex={fromIndex}
					setFromIndex={setNewFromIndexPreservingScrollPosition}
					items={thread.comments}
					onShowAll={onShowAll}/>
			}
			<div className="ThreadPage-commentsContainer">
				<CommentsList
					searchQuery={searchQuery}
					thread={thread}
					shownComments={shownComments}
					itemComponentProps={itemComponentProps}
					getCommentById={getCommentById}
					preserveScrollPositionOnPrependItems={preserveScrollPositionOnPrependItems}
					onMount={onMount}
					className={classNames('ThreadPage-comments', {
						// 'ThreadPage-comments--fromTheStart': fromIndex === 0
					})}
				/>
				{/*noNewComments &&
					<p className="ThreadPage-noNewComments">
						{messages.noNewComments}
					</p>
				*/}
			</div>
			{!searchQuery && !(thread.locked || thread.expired) &&
				<React.Fragment>
					<AutoUpdate
						autoStart={initiallyShowCommentsFromTheLatestReadOne && initialLatestReadCommentIndex === thread.comments.length - 1}/>
					{/*<PostForm onSubmit={onSubmitReply}/>*/}
					{thread.bumpLimitReached &&
						<InfoBanner
							Icon={SinkingBoatIcon}>
							{messages.threadBumpLimitReached}
						</InfoBanner>
					}
				</React.Fragment>
			}
			{!searchQuery && thread.archived &&
				<InfoBanner
					Icon={BoxIcon}>
					{messages.threadIsArchived}
				</InfoBanner>
			}
			{!searchQuery && !thread.archived && thread.locked &&
				<InfoBanner
					Icon={LockIcon}>
					{messages.threadIsLocked}
				</InfoBanner>
			}
			{!searchQuery && thread.expired &&
				<InfoBanner
					Icon={GhostIcon}>
					{messages.threadExpired}
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
					onRequestShowCommentFromSameThread={onRequestShowCommentFromSameThread}
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
// https://github.com/4Catalyzer/found/issues/639#issuecomment-567084189
// https://gitlab.com/catamphetamine/react-pages#same-route-navigation
export default function ThreadPageWrapper() {
	const channelId = useSelector(state => state.data.channel.id)
	const threadId = useSelector(state => state.data.thread.id)
	return <ThreadPage key={`${channelId}/${threadId}`}/>
}
ThreadPageWrapper.meta = ThreadPage.meta
ThreadPageWrapper.load = ThreadPage.load