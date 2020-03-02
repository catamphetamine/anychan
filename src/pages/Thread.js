import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'

import {
	Link,
	isInstantBackAbleNavigation,
	wasInstantNavigation,
	goBack,
	canGoBackInstantly
} from 'react-pages'

import { useSelector, useDispatch } from 'react-redux'
import classNames from 'classnames'
// import ReactTimeAgo from 'react-time-ago'
import { Button } from 'react-responsive-ui'

import { setVirtualScrollerState } from '../redux/thread'
import { getThread } from '../redux/chan'
import { trackThread, untrackThread, threadExpired } from '../redux/threadTracker'
import { openSlideshow } from 'webapp-frontend/src/redux/slideshow'
import { notify } from 'webapp-frontend/src/redux/notifications'

import UserData from '../UserData/UserData'
import { addChanParameter } from '../chan'
import getMessages from '../messages'
import getUrl from '../utility/getUrl'
import { updateAttachmentThumbnailMaxSize } from '../utility/postThumbnail'
import openLinkInNewTab from 'webapp-frontend/src/utility/openLinkInNewTab'
// import { getViewportWidth } from 'webapp-frontend/src/utility/dom'
import { getViewportHeight } from 'webapp-frontend/src/utility/dom'
import hasAttachmentPicture from 'social-components/commonjs/utility/attachment/hasPicture'
import getThumbnailSize from 'social-components/commonjs/utility/attachment/getThumbnailSize'

import BackToPreviousComment from '../components/BackToPreviousComment'
import InReplyToModal, { InReplyToModalCloseTimeout, InReplyToModalScrollToTopAndFocus } from '../components/InReplyToModal'
import ThreadCommentsList from '../components/ThreadCommentsList'
import ShowPrevious from '../components/ShowPrevious'
import BoardThreadMenu from '../components/BoardThreadMenu'
import ThreadCommentTree from '../components/ThreadCommentTree'
import { isSlideSupported } from 'webapp-frontend/src/components/Slideshow'
import { preloadPictureSlide } from 'webapp-frontend/src/components/Slideshow.Picture'

import LeftArrow from 'webapp-frontend/assets/images/icons/left-arrow-minimal.svg'
// import CommentIcon from 'webapp-frontend/assets/images/icons/message-rect-dots.svg'
import CommentIcon from 'webapp-frontend/assets/images/icons/message-rounded-rect-square.svg'
import DownRightArrow from 'webapp-frontend/assets/images/icons/down-right-arrow.svg'
import SinkingBoatIcon from '../../assets/images/icons/sinking-boat.svg'

import './Thread.css'

function ThreadPage({
	match
}) {
	const board = useSelector(({ chan }) => chan.board)
	const thread = useSelector(({ chan }) => chan.thread)
	const locale = useSelector(({ settings }) => settings.settings.locale)
	const isThreadTracked = useSelector(({ threadTracker }) => threadTracker.trackedThreadsIndex[board.id] && threadTracker.trackedThreadsIndex[board.id].includes(thread.id))
	const restoredVirtualScrollerState = useSelector(({ thread }) => thread.virtualScrollerState)
	const dispatch = useDispatch()
	const [isSearchBarShown, setSearchBarShown] = useState()
	const [searchQuery, setSearchQuery] = useState()
	const virtualScroller = useRef()
	const virtualScrollerState = useRef()
	const [areAttachmentsExpanded, setAttachmentsExpanded] = useState(wasInstantNavigation() && restoredVirtualScrollerState && restoredVirtualScrollerState.expandAttachments)
	const onSetAttachmentsExpanded = useCallback((expandAttachments) => {
		if (virtualScrollerState.current) {
			virtualScrollerState.current.expandAttachments = expandAttachments
		}
		setAttachmentsExpanded(expandAttachments)
	}, [setAttachmentsExpanded])
	const openThreadWideSlideshow = useCallback(async () => {
		const attachments = thread.comments.reduce(
			(attachments, comment) => attachments.concat(comment.attachments || []),
			[]
		).filter(isSlideSupported)
		if (attachments[0].type === 'picture') {
			try {
				await preloadPictureSlide(attachments[0])
			} catch (error) {
				console.error(error)
			}
		}
		dispatch(openSlideshow(attachments, 0, { mode: 'flow' }))
	}, [thread, dispatch])
	// Using `useMemo()` here to avoid reading from `localStorage` on each render.
	// Maybe it's not required, but just in case.
	const _initialFromIndex = useMemo(() => getFromIndex(board, thread, match.location), [board, thread, location])
	const initialFromIndex = wasInstantNavigation() && restoredVirtualScrollerState ? restoredVirtualScrollerState.fromIndex : _initialFromIndex
	// `setFromIndex()` shouldn't be called directly.
	// Instead, it should be called via `onSetFromIndex()`.
	const [fromIndex, setFromIndex] = useState(initialFromIndex)
	// `fromIndexRef` is only used in `onShowComment()`
	// to prevent changing `itemComponentProps` when `fromIndex` changes
	// which would happen if `onShowComment()` used `fromIndex` directly.
	// This results in not re-rendering the whole comments list
	// when clicking "Show previous" button.
	const fromIndexRef = useRef(fromIndex)
	const onSetFromIndex = useCallback((fromIndex) => {
		setFromIndex(fromIndex)
		fromIndexRef.current = fromIndex
		if (virtualScrollerState.current) {
			virtualScrollerState.current.fromIndex = fromIndex
		}
	}, [setFromIndex])
	const initialVirtualScrollerCustomState = useMemo(() => ({
		// expandAttachments: false,
		fromIndex
	}), [fromIndex])
	const shownComments = useMemo(() => thread.comments.slice(fromIndex), [thread, fromIndex])
	const getItem = useCallback(
		(i) => thread.comments[fromIndex + i],
		[fromIndex, thread]
	)
	// Runs only once before the initial render.
	// Sets `--PostThumbnail-maxWidth` CSS variable.
	useMemo(
		() => updateAttachmentThumbnailMaxSize(thread.comments),
		[thread]
	)
	const onSetThreadTracked = useCallback((shouldTrackThread) => {
		if (shouldTrackThread) {
			const latestComment = thread.comments[thread.comments.length - 1]
			const trackedThread = {
				id: thread.id,
				title: thread.title,
				board: {
					id: board.id,
					title: board.title
				},
				latestComment: {
					id: latestComment.id,
					createdAt: latestComment.createdAt.getTime(),
				}
			}
			const thumbnailAttachment = thread.comments[0].attachments && thread.comments[0].attachments.filter(hasAttachmentPicture)[0]
			if (thumbnailAttachment) {
				const thumbnail = getThumbnailSize(thumbnailAttachment)
				trackedThread.thumbnail = {
					type: thumbnail.type,
					url: thumbnail.url,
					width: thumbnail.width,
					height: thumbnail.height
				}
				if (thumbnailAttachment.spoiler) {
					trackedThread.thumbnail.spoiler = true
				}
			}
			dispatch(trackThread(trackedThread))
		} else {
			dispatch(untrackThread({
				id: thread.id,
				board: {
					id: board.id
				}
			}))
		}
	}, [board, thread, dispatch])
	const [commentNavigationHistory, setCommentNavigationHistory] = useState([])
	// `commentNavigationHistoryRef` is only used in `onShowComment()`
	// to prevent changing `itemComponentProps` when `commentNavigationHistory` changes
	// which would happen if `onShowComment()` used `commentNavigationHistory` directly.
	// This results in not re-rendering the whole comments list
	// when clicking "Show previous" button.
	const commentNavigationHistoryRef = useRef(commentNavigationHistory)
	const onSetCommentNavigationHistory = useCallback((history) => {
		setCommentNavigationHistory(history)
		commentNavigationHistoryRef.current = history
	}, [])
	const resetCommentNavigationHistoryTimeout = useRef()
	const [inReplyToModalHistory, setInReplyToModalHistory] = useState()
	const onShowCommentHistoryModal = useCallback(() => {
		clearTimeout(resetCommentNavigationHistoryTimeout.current)
		setInReplyToModalHistory(true)
	}, [setInReplyToModalHistory, onSetCommentNavigationHistory])
	const onHideCommentHistoryModal = useCallback(() => {
		clearTimeout(resetCommentNavigationHistoryTimeout.current)
		resetCommentNavigationHistoryTimeout.current = setTimeout(() => {
			onSetCommentNavigationHistory([])
		}, InReplyToModalCloseTimeout)
		setInReplyToModalHistory(false)
	}, [setInReplyToModalHistory, onSetCommentNavigationHistory])
	const onShowComment = useCallback((commentId, fromCommentId) => {
		const index = thread.comments.findIndex(_ => _.id === commentId)
		if (index < 0) {
			dispatch(notify(getMessages(locale).noSearchResults))
			console.error(`Comment #${commentId} not found`)
			return
		}
		const comment = thread.comments[index]
		// Displaying a modal with comment content is used
		// instead of scrolling to the comment.
		// // `fromIndexRef` is used instead of `fromIndex`
		// // to avoid having `fromIndex` in the list of dependencies
		// // which would result in re-rendering all comments
		// // when a user clicks "Show previous" button.
		// const fromIndex = fromIndexRef.current
		// if (index < fromIndex) {
		// 	dispatch(notify('Comment not rendered'))
		// 	return
		// }
		// const { top } = virtualScroller.current.getItemCoordinates(index - fromIndex)
		// const headerHeight = document.querySelector('.webpage__header').offsetHeight
		// window.scrollTo(0, top - headerHeight)
		onShowCommentHistoryModal(true)
		if (fromCommentId) {
			let history = commentNavigationHistoryRef.current
			// This turned out to feel inconsistent, so this feature was disabled.
			// // Don't add an entry to the history if the comment with the
			// // `post-link` being clicked is still visible after scrolling
			// // to the quoted comment (with some bottom margin).
			// const fromCommentIndex = thread.comments.findIndex(_ => _.id === fromCommentId);
			// const { top: fromCommentTop } = virtualScroller.current.getItemCoordinates(fromCommentIndex - fromIndex)
			// if (fromCommentTop > top - headerHeight + getViewportHeight() * 0.9) {
				// onSetCommentNavigationHistory(history.concat({ commentId: fromCommentId }))
				// Add the initial "from" history entry.
				if (history.length === 0) {
					history = history.concat(
						thread.comments.find(_ => _.id === fromCommentId)
					)
				}
				if (!comment.contentParsed) {
					comment.parseContent()
				}
				onSetCommentNavigationHistory(history.concat(comment))
				// Scroll comment history modal to top.
				InReplyToModalScrollToTopAndFocus()
			// }
		}
	},
	// This dependencies list should be such that
	// comments aren't re-rendered when they don't need to.
	// (`itemComponentProps` depends on `onShowComment`)
	[thread, dispatch, locale])
	const onGoBackCommentHistoryModal = useCallback(() => {
		const newCommentNavigationHistory = commentNavigationHistory.slice()
		newCommentNavigationHistory.pop()
		onSetCommentNavigationHistory(newCommentNavigationHistory)
		// Scroll comment history modal to top.
		InReplyToModalScrollToTopAndFocus()
	}, [onSetCommentNavigationHistory, commentNavigationHistory])
	// const onBackToPreviouslyViewedComment = useCallback(() => {
	// 	const latest = commentNavigationHistory.pop()
	// 	// onShowComment(latest.commentId)
	// 	onShowComment(latest.id)
	// 	onSetCommentNavigationHistory(commentNavigationHistory.slice())
	// }, [onShowComment, commentNavigationHistory])
	const itemComponentProps = useMemo(() => ({
		// `onPostContentChange()` is passed to `<Post/>`.
		// It's called whenever there's a parent comment who's `content` did change
		// (YouTube video links get loaded, Twitter links get loaded, etc) and there're "replies"
		// to that parent comment having "autogenerated" quotes of that parent comment `content`.
		// So when the parent comment `content` is re-rendered all its "replies" should be
		// re-rendered too and that's what this function is for: it's called for each reply
		// of a post who's `content` did change.
		onPostContentChange(id) {
			const index = thread.comments.findIndex(_ => _.id === id)
			virtualScroller.current.renderItem(index)
		},
		mode: 'thread',
		board,
		thread,
		dispatch,
		locale,
		expandAttachments: areAttachmentsExpanded,
		onShowComment
		// `itemComponentProps` dependencies list should be such
		// that comments aren't re-rendered when they don't need to.
	}), [thread, areAttachmentsExpanded, dispatch, onShowComment])
	const onBack = useCallback((event) => {
		if (canGoBackInstantly()) {
			dispatch(goBack())
			event.preventDefault()
		}
	}, [dispatch])
	// `showAllInProgress` and `showAllWillFinish` are only used
	// so that `VirtualScroller`'s `preserveScrollPositionOnPrependItems`
	// feature is briefly deactivated when the user clicks "Show all comments" button.
	const [showAllInProgress, setShowAllInProgress] = useState()
	const [showAllWillFinish, setShowAllWillFinish] = useState()
	const onShowAll = useCallback(() => {
		setShowAllInProgress(true)
	}, [setShowAllInProgress])
	useEffect(() => {
		if (showAllInProgress) {
			onSetFromIndex(0)
			setShowAllWillFinish(true)
		}
	}, [
		showAllInProgress,
		onSetFromIndex,
		setShowAllWillFinish
	])
	useEffect(() => {
		if (showAllWillFinish) {
			setShowAllInProgress(false)
			setShowAllWillFinish(false)
		}
	}, [
		showAllWillFinish,
		setShowAllInProgress,
		setShowAllWillFinish
	])
	// `showSpecificCommentIndex` and `showSpecificCommentWillFinish` are only used
	// so that `VirtualScroller`'s `preserveScrollPositionOnPrependItems`
	// feature is briefly deactivated when the user clicks on a comment date
	// inside an "In Reply To" modal.
	const [showSpecificCommentIndex, setShowSpecificCommentIndex] = useState()
	const [showSpecificCommentWillFinish, setShowSpecificCommentWillFinish] = useState()
	const onGoToComment = useCallback((comment) => {
		const index = thread.comments.indexOf(comment)
		if (index < 0) {
			throw new Error(`Comment ${comment.id} not found`)
		}
		setShowSpecificCommentIndex(index)
	}, [thread, setShowSpecificCommentIndex])
	useEffect(() => {
		if (showSpecificCommentIndex !== undefined) {
			onSetFromIndex(showSpecificCommentIndex)
			setShowSpecificCommentWillFinish(true)
		}
	}, [
		showSpecificCommentIndex,
		onSetFromIndex,
		setShowSpecificCommentWillFinish
	])
	useEffect(() => {
		if (showSpecificCommentWillFinish) {
			setShowSpecificCommentIndex(undefined)
			setShowSpecificCommentWillFinish(false)
		}
	}, [
		showSpecificCommentWillFinish,
		setShowSpecificCommentIndex,
		setShowSpecificCommentWillFinish
	])
	const preserveScrollPositionOnPrependItems = showAllInProgress || showSpecificCommentIndex ? false : true
	// const backToPreviouslyViewedCommentButtonRight = document.querySelector('.thread-comment') && document.querySelector('.thread-comment').getBoundingClientRect().right
	// const backToPreviouslyViewedCommentButtonStyle = useMemo(() => {
	// 	if (backToPreviouslyViewedCommentButtonRight === null) {
	// 		return undefined
	// 	}
	// 	return {
	// 		right: (getViewportWidth() - backToPreviouslyViewedCommentButtonRight) + 'px'
	// 	}
	// }, [backToPreviouslyViewedCommentButtonRight])
	const threadMenu = (
		<BoardThreadMenu
			mode="thread"
			dispatch={dispatch}
			locale={locale}
			openSlideshow={openThreadWideSlideshow}
			isThreadTracked={isThreadTracked}
			setThreadTracked={onSetThreadTracked}
			isSearchBarShown={isSearchBarShown}
			setSearchBarShown={setSearchBarShown}
			areAttachmentsExpanded={areAttachmentsExpanded}
			setAttachmentsExpanded={onSetAttachmentsExpanded}/>
	)
	const threadStats = (
		<div className="thread-page__stats">
			{/* Using a `<div/>` wrapper here because `title`
			    doesn't seem to work on `<svg/>`s. */}
			{fromIndex === 0 && shownComments.length > 0 &&
				<React.Fragment>
					<div
						title={fromIndex === 0 ? getMessages(locale).post.commentsCount : getMessages(locale).newComments}
						className="thread-page__stats-icon-container">
						<CommentIcon className="thread-page__stats-icon thread-page__stats-comment-icon"/>
					</div>
					<span
						title={fromIndex === 0 ? getMessages(locale).post.commentsCount : getMessages(locale).newComments}>
						{shownComments.length}
					</span>
					{/*
					<span className="thread-page__latest-comment-date-separator">
						/
					</span>
					<ReactTimeAgo
						date={thread.comments[thread.comments.length - 1].createdAt}
						locale={locale}
						tooltip={false}
						title={getMessages(locale).lastComment}
						className="thread-page__latest-comment-date"/>
					*/}
				</React.Fragment>
			}
			{/*
			{!thread.isBumpLimitReached && thread.willExpireSoon &&
				<div
					title={getMessages(locale).threadExpiresSoon.replace('{0}', 1).replace('{1}', 2)}
					className="thread-page__stats-icon-container">
					<DownRightArrow className="thread-page__stats-icon thread-page__stats-down-right-arrow-icon"/>
				</div>
			}
			{thread.isBumpLimitReached &&
				<div
					title={getMessages(locale).post.bumpLimitReached}
					className="thread-page__stats-icon-container">
					<SinkingBoatIcon className="thread-page__stats-icon thread-page__stats-sinking-icon"/>
				</div>
			}
			*/}
		</div>
	)
	return (
		<section className={classNames('thread-page', 'content')}>
			{/*
			<header className="thread-page__header page__heading">
				<div className="page__heading-text">
					<Link to={getUrl(board)}>
						{board.title}
					</Link>
				</div>
				<h1 className="page__heading-text">
					{thread.titleCensored || thread.title}
				</h1>
			</header>
			*/}
			<div className="thread-page__header">
				<Link
					to={getUrl(board)}
					onClick={onBack}
					className="thread-page__header-back-link">
					<LeftArrow className="thread-page__header-back-arrow"/>
					<span className="thread-page__header-back-title">
						{board.title}
					</span>
				</Link>
				<div className="thread-page__menu-and-stats thread-page__menu-and-stats--header">
					{React.cloneElement(threadStats, {
						className: classNames(threadStats.props.className, 'thread-page__stats--header')
					})}
					{React.cloneElement(threadMenu, { className: 'thread-page__menu--header' })}
				</div>
			</div>
			{fromIndex > 0 &&
				<ShowPrevious
					fromIndex={fromIndex}
					setFromIndex={onSetFromIndex}
					items={thread.comments}
					onShowAll={onShowAll}
					locale={locale}/>
			}
			<div className="thread-page__menu-and-stats thread-page__menu-and-stats--above-content">
				{React.cloneElement(threadStats)}
				{React.cloneElement(threadMenu, { className: 'thread-page__menu--above-content' })}
			</div>
			<div className="thread-page__comments-container">
				{/*!searchQuery && commentNavigationHistory.length > 0 &&
					<BackToPreviousComment
						locale={locale}
						onClick={onBackToPreviouslyViewedComment}/>
				*/}
				{searchQuery &&
					<ThreadCommentsList
						key="searchResults"/>
				}
				{shownComments.length > 0 && !searchQuery &&
					<ThreadCommentsList
						key="comments"
						ref={virtualScroller}
						getItem={getItem}
						initialCustomState={initialVirtualScrollerCustomState}
						restoredState={restoredVirtualScrollerState}
						setState={setVirtualScrollerState}
						stateRef={virtualScrollerState}
						items={shownComments}
						itemComponent={CommentComponent}
						itemComponentProps={itemComponentProps}
						preserveScrollPositionOnPrependItems={preserveScrollPositionOnPrependItems}
						preserveScrollPositionAtBottomOnMount={initialFromIndex === thread.comments.length}
						className={classNames('thread-page__comments', {
							'thread-page__comments--from-the-start': fromIndex === 0
						})}/>
				}
				{shownComments.length === 0 &&
					<p className="thread-page__no-new-comments">
						{getMessages(locale).noNewComments}
					</p>
				}
			</div>
			{commentNavigationHistory.length > 0 &&
				<InReplyToModal
					board={board}
					thread={thread}
					isOpen={inReplyToModalHistory}
					onClose={onHideCommentHistoryModal}
					onGoBack={onGoBackCommentHistoryModal}
					history={commentNavigationHistory}
					onShowComment={onShowComment}
					onGoToComment={onGoToComment}/>
			}
		</section>
	)
}

ThreadPage.propTypes = {
	match: PropTypes.shape({
		location: PropTypes.shape({
			hash: PropTypes.string
		}).isRequired
	}).isRequired
}

ThreadPage.meta = ({ chan: { board, thread }}) => ({
	title: thread && thread.title || board && board.title,
	description: thread && thread.comments[0].textPreview,
	image: thread && getThreadImage(thread)
})

ThreadPage.load = async ({ getState, dispatch, params }) => {
	const boardId = params.board
	const threadId = parseInt(params.thread)
	try {
		await dispatch(getThread(
			boardId,
			threadId,
			getState().settings.settings.censoredWords,
			getState().settings.settings.locale
		))
	} catch (error) {
		if (error.status === 404) {
			// Clear expired thread from user data.
			dispatch(threadExpired({ boardId, threadId }))
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

// `CommentComponent` is required to be a `Component`
// in order to be `ref`-able inside `virtual-scroller`
// in order for `.renderItem(i)` to be able to be called.
// Made it a `PureComponent` to optimize `<VirtualScroller/>` re-rendering.
class CommentComponent extends React.PureComponent {
	render() {
		const {
			children: comment,
			...rest
		} = this.props
		return (
			<ThreadCommentTree
				key={comment.id}
				comment={comment}
				{...rest}/>
		)
	}
}

CommentComponent.propTypes = {
	children: PropTypes.object.isRequired
}

function getFromIndex(board, thread, location) {
	if (location.hash) {
		const commentId = parseInt(location.hash.slice('#'.length))
		if (!isNaN(commentId)) {
			const commentIndex = thread.comments.findIndex(_ => _.id === commentId)
			if (commentIndex >= 0) {
				return commentIndex
			}
		}
	}
	const latestReadCommentInfo = UserData.getLatestReadComments(board.id, thread.id)
	if (latestReadCommentInfo) {
		const { id: latestReadCommentId } = latestReadCommentInfo
		const afterLatestReadCommentIndex = thread.comments.findIndex((comment) => {
			return comment.id > latestReadCommentId
		})
		if (afterLatestReadCommentIndex >= 0) {
			return afterLatestReadCommentIndex
		}
		return thread.comments.length
	}
	return 0
}

// This is a workaround for cases when `found` doesn't remount
// page component when navigating to the same route.
// https://github.com/4Catalyzer/found/issues/639
export default function ThreadPageWrapper({ match }) {
	const board = useSelector(({ chan }) => chan.board)
	const thread = useSelector(({ chan }) => chan.thread)
	return <ThreadPage key={`${board.id}/${thread.id}`} match={match}/>
}
ThreadPageWrapper.meta = ThreadPage.meta
ThreadPageWrapper.load = ThreadPage.load
ThreadPageWrapper.propTypes = {
	match: PropTypes.shape({
		location: PropTypes.shape({
			hash: PropTypes.string
		}).isRequired
	}).isRequired
}