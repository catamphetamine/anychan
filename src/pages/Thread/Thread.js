import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { useSelector, useDispatch } from 'react-redux'

import {
	isInstantBackAbleNavigation,
	wasInstantNavigation,
	goBack,
	canGoBackInstantly
} from 'react-pages'

import { setVirtualScrollerState, setScrollPosition } from '../../redux/thread'
import { getThread, resetNewAutoUpdateCommentIndexes } from '../../redux/data'

import getMessages from '../../messages'
import { updateAttachmentThumbnailMaxSize } from '../../utility/postThumbnail'
import onThreadFetched from '../../utility/onThreadFetched'
import onThreadExpired from '../../utility/onThreadExpired'
import UnreadCommentWatcher from '../../utility/UnreadCommentWatcher'
import createByIdIndex from '../../utility/createByIdIndex'

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

import GhostIcon from 'webapp-frontend/assets/images/icons/ghost-neutral-cross-eyes-mouth-tongue.svg'
import LockIcon from 'webapp-frontend/assets/images/icons/lock.svg'
import SinkingBoatIcon from '../../../assets/images/icons/sinking-boat.svg'

import './Thread.css'

function ThreadPage({
	howManyCommentsToShowBeforeLatestReadComment
}) {
	const [isSearchBarShown, setSearchBarShown] = useState()
	const [searchQuery, setSearchQuery] = useState()

	// Redux state.
	const channel = useSelector(({ data }) => data.channel)
	const thread = useSelector(({ data }) => data.thread)
	const locale = useSelector(({ settings }) => settings.settings.locale)

	const dispatch = useDispatch()

	const unreadCommentWatcher = useMemo(() => {
		return new UnreadCommentWatcher({ dispatch })
	}, [])

	useEffect(() => {
		return () => {
			unreadCommentWatcher.stop()
			dispatch(resetNewAutoUpdateCommentIndexes())
		}
	}, [])

	// Runs only once before the initial render.
	// Sets `--PostThumbnail-maxWidth` CSS variable.
	useMemo(
		() => updateAttachmentThumbnailMaxSize(thread.comments),
		// Update on new comments.
		// `thread.comments[]` changes on every auto-update,
		// regardless of whether there're any new comments.
		[thread.comments[thread.comments.length - 1].id]
	)

	const [isThreadTracked, setThreadTracked] = useTrackedThread({
		channel,
		thread
	})

	// `<VirtualScroller/>`
	const virtualScroller = useRef()
	const virtualScrollerState = useRef()
	const _restoredVirtualScrollerState = useSelector(({ thread }) => thread.virtualScrollerState)
	const restoredVirtualScrollerState = wasInstantNavigation() ? _restoredVirtualScrollerState : undefined
	const _restoredScrollPosition = useSelector(({ thread }) => thread.scrollPosition)
	const restoredScrollPosition = wasInstantNavigation() ? _restoredScrollPosition : undefined

	// "Expand attachments".
	const [areAttachmentsExpanded, setAttachmentsExpanded] = useExpandAttachments({
		restoredVirtualScrollerState,
		virtualScrollerState
	})

	// First shown comment index.
	const [
		fromIndex,
		setNewFromIndex,
		setNewFromIndexPreservingScrollPosition,
		preserveScrollPositionOnPrependItems,
		initialFromIndex,
		isInitialFromIndex,
		initialLatestReadCommentIndex,
		initiallyShowCommentsFromTheLatestReadOne
	] = useFromIndex({
		channel,
		thread,
		location,
		howManyCommentsToShowBeforeLatestReadComment,
		restoredVirtualScrollerState,
		virtualScrollerState
	})

	const [
		openSlideshow
	] = useSlideshow({
		thread,
		fromIndex,
		setNewFromIndex
	})

	// `<VirtualScroller/>`
	const initialVirtualScrollerCustomState = useMemo(() => ({
		// expandAttachments: false,
		fromIndex,
		initialLatestReadCommentIndex
	}), [
		fromIndex,
		initialLatestReadCommentIndex
	])

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

	// `getCommentById()` function parameter is only used when
	// calling `comment.onContentChange()` function.
	// Therefore, it's not a "rendering property" in a sense that
	// it doesn't have any influence on how comments are rendered.
	// Therefore, it can be removed from `itemComponentProps`
	// memo dependencies list because the item component isn't
	// required to be rerendered when `getCommentById()` function changes.
	// Therefore, it can be passed as a `ref`: this way, it will
	// always be up to date while also not being a dependency.
	const getCommentByIdRef = useRef()
	getCommentByIdRef.current = useMemo(() => {
		return createByIdIndex(thread.comments)
	}, [thread.comments])
	const getCommentById = useCallback((id) => {
		return getCommentByIdRef.current(id)
	}, [])

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
	// whose `content` did change (for example, when YouTube video links got loaded,
	// or Twitter links got loaded, etc), and when there're any "replies" to that
	// parent comment having "autogenerated" quotes generated from that parent comment's content.
	// It also doesn't stop at that level, and goes arbitrarily deep into the replies tree,
	// because there might be "deeper" replies to a reply having an "autogenerated" quote,
	// and those "deeper" replies' "autogenerated" quotes might be autogenerated from that
	// "autogenerated" quote, so the whole thing is recursive.
	// So, when the parent comment's `content` changes (for example, as a result of
	// loading "resource" links), all of the affected (descendant) "replies" should be
	// re-rendered too.
	const renderComment = useCallback((id) => {
		// `loadResourceLinks()` calls `renderComment()` on every replying comment,
		// regardless of whether such replying comment is rendered or not.
		// Also, loading resource links is done "asynchronously", and that
		// process may finish already after the comment tree itself is unmounted.
		if (virtualScroller.current) {
			// `VirtualScroller` will find the index of the item by its id,
			// because `getItemId()` parameter will also be passed.
			virtualScroller.current.renderItem({ id })
		}
	}, [])

	// Returns `true` if the comment has been "previously read".
	// "Previously read" means that it has been read on the previous
	// view of this thread's page.
	const isPreviouslyRead = useCallback((commentId) => {
		// Don't mark comments as "previously read" when the user starts
		// looking through "previous comments" via "Show previous comments":
		// in that case, `isInitialFromIndex` will be `false`.
		if (initiallyShowCommentsFromTheLatestReadOne && isInitialFromIndex) {
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
		initialFromIndex,
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
		threadId: thread.id,
		dispatch,
		locale,
		unreadCommentWatcher,
		expandPostLinkBlockQuotes: false,
		expandAttachments: areAttachmentsExpanded,
		onShowComment: onNavigateToComment,
		isPreviouslyRead
	}), [
		// The dependencies list should be such that
		// comments aren't re-rendered when they don't need to.
		channel,
		thread.expired,
		thread.isLocked,
		thread.id,
		areAttachmentsExpanded,
		renderComment,
		getCommentById,
		isPreviouslyRead,
		dispatch,
		locale,
		unreadCommentWatcher,
		onNavigateToComment
	])

	const onSubmitReply = useCallback(() => {
		alert('Not implemented')
		// Disable reply form.
		// Show a spinner.
		// Trigger an auto-update.
		// Trigger an auto-update after a second.
		// Trigger an auto-update after 5 seconds.
		// Wait for the new comment to be fetched as part of thread auto-update.
		// Clear the reply form.
		// Focus the form.
	})

	const onBack = useCallback((event) => {
		if (canGoBackInstantly()) {
			dispatch(goBack())
			event.preventDefault()
		}
	}, [dispatch])

	const onGoToComment = useCallback((comment) => {
		const index = thread.comments.indexOf(comment)
		if (index < 0) {
			throw new Error(`Comment ${comment.id} not found`)
		}
		setNewFromIndex(index)
	}, [
		thread,
		setNewFromIndex
	])

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
				onBack={onBack}
				locale={locale}
				openSlideshow={openSlideshow}
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
						initialCustomState={initialVirtualScrollerCustomState}
						restoredState={restoredVirtualScrollerState}
						setState={setVirtualScrollerState}
						stateRef={virtualScrollerState}
						restoredScrollPosition={restoredScrollPosition}
						setScrollPosition={setScrollPosition}
						items={shownComments}
						itemComponent={ThreadComment}
						itemComponentProps={itemComponentProps}
						getCommentById={getCommentById}
						preserveScrollPositionOnPrependItems={preserveScrollPositionOnPrependItems}
						preserveScrollPositionOfTheBottomOfTheListOnMount={initialFromIndex === thread.comments.length}
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
					{/*<PostForm onSubmit={onSubmitReply}/>*/}
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

ThreadPage.propTypes = {
	howManyCommentsToShowBeforeLatestReadComment: PropTypes.number.isRequired
}

ThreadPage.defaultProps = {
	howManyCommentsToShowBeforeLatestReadComment: 0
}

ThreadPage.meta = ({ data: { channel, thread }}) => ({
	title: thread && ('/' + channel.id + '/' + ' — ' + (thread.titleCensored || thread.title)),
	description: thread && thread.comments[0].textPreview,
	image: thread && getThreadImage(thread)
})

ThreadPage.load = async ({ getState, dispatch, params }) => {
	const channelId = params.channelId
	const threadId = parseInt(params.threadId)
	const settings = getState().settings.settings
	try {
		const thread = await dispatch(getThread(channelId, threadId, {
			censoredWords: settings.censoredWords,
			grammarCorrection: settings.grammarCorrection,
			locale: settings.locale
		}))
		onThreadFetched(thread, { dispatch })
	} catch (error) {
		if (error.status === 404) {
			// Clear expired thread from user data.
			onThreadExpired(channelId, threadId, { dispatch })
		}
		throw error
	}
}

function getThreadImage(thread) {
	const comment = thread.comments[0]
	if (comment.attachments && comment.attachments.length > 0) {
		for (const attachment of comment.attachments) {
			switch (attachment.type) {
				case 'picture':
					return attachment.picture.url
				case 'video':
					return attachment.video.picture.url
			}
		}
	}
}

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