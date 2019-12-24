import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'

import {
	Link,
	isInstantBackAbleNavigation,
	goBack,
	canGoBackInstantly
} from 'react-pages'

import { useSelector, useDispatch } from 'react-redux'
import classNames from 'classnames'
// import ReactTimeAgo from 'react-time-ago'
import { Button } from 'react-responsive-ui'

import { setVirtualScrollerState, setScrollPosition } from '../redux/thread'
import { getThread } from '../redux/chan'
import { trackThread, untrackThread, threadExpired } from '../redux/threadTracker'
import { openSlideshow } from 'webapp-frontend/src/redux/slideshow'
import { notify } from 'webapp-frontend/src/redux/notifications'

import UserData from '../UserData/UserData'
import { addChanParameter } from '../chan'
import getMessages from '../messages'
import getUrl from '../utility/getUrl'
import updateAttachmentThumbnailMaxSize from '../utility/updateAttachmentThumbnailMaxSize'
import openLinkInNewTab from 'webapp-frontend/src/utility/openLinkInNewTab'
// import { getViewportWidth } from 'webapp-frontend/src/utility/dom'
import { getViewportHeight } from 'webapp-frontend/src/utility/dom'
import hasAttachmentPicture from 'social-components/commonjs/utility/attachment/hasPicture'
import getThumbnailSize from 'social-components/commonjs/utility/attachment/getThumbnailSize'

import ThreadCommentsList from '../components/ThreadCommentsList'
import ShowPrevious from '../components/ShowPrevious'
import BoardOrThreadMenu from '../components/BoardOrThreadMenu'
import ThreadCommentTree from '../components/ThreadCommentTree'
import { isSlideSupported } from 'webapp-frontend/src/components/Slideshow'
import { preloadPictureSlide } from 'webapp-frontend/src/components/Slideshow.Picture'

import LeftArrow from 'webapp-frontend/assets/images/icons/left-arrow-minimal.svg'
// import CommentIcon from 'webapp-frontend/assets/images/icons/message-rect-dots.svg'
import CommentIcon from 'webapp-frontend/assets/images/icons/message-rounded-rect-square.svg'
import DownRightArrow from 'webapp-frontend/assets/images/icons/down-right-arrow.svg'
import SinkingBoatIcon from '../../assets/images/icons/sinking-boat.svg'

import './Thread.css'

function ThreadPage() {
	const board = useSelector(({ chan }) => chan.board)
	const thread = useSelector(({ chan }) => chan.thread)
	const locale = useSelector(({ settings }) => settings.settings.locale)
	const isThreadTracked = useSelector(({ threadTracker }) => threadTracker.trackedThreadsIndex[board.id] && threadTracker.trackedThreadsIndex[board.id].includes(thread.id))
	const initialVirtualScrollerState = useSelector(({ thread }) => thread.virtualScrollerState)
	const scrollPosition = useSelector(({ thread }) => thread.scrollPosition)
	const dispatch = useDispatch()
	const [isSearchBarShown, setSearchBarShown] = useState()
	const [searchQuery, setSearchQuery] = useState()
	const virtualScroller = useRef()
	const virtualScrollerState = useRef()
	const [areAttachmentsExpanded, setAttachmentsExpanded] = useState(initialVirtualScrollerState && initialVirtualScrollerState.expandAttachments)
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
	const initialFromIndex = useMemo(() => getFromIndex(board, thread))
	const [fromIndex, setFromIndex] = useState(initialFromIndex)
	// `fromIndexRef` is only used in `scrollToComment()`
	// to prevent changing `itemComponentProps` when `fromIndex` changes
	// which would happen if `scrollToComment()` used `fromIndex` directly.
	// This results in not re-rendering the whole comments list
	// when clicking "Show previous" button.
	const fromIndexRef = useRef(fromIndex)
	const onSetFromIndex = useCallback((fromIndex) => {
		setFromIndex(fromIndex)
		fromIndexRef.current = fromIndex
	}, [])
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
	// `commentNavigationHistoryRef` is only used in `scrollToComment()`
	// to prevent changing `itemComponentProps` when `commentNavigationHistory` changes
	// which would happen if `scrollToComment()` used `commentNavigationHistory` directly.
	// This results in not re-rendering the whole comments list
	// when clicking "Show previous" button.
	const commentNavigationHistoryRef = useRef(commentNavigationHistory)
	const onSetCommentNavigationHistory = useCallback((history) => {
		setCommentNavigationHistory(history)
		commentNavigationHistoryRef.current = history
	}, [])
	const scrollToComment = useCallback((commentId, fromCommentId) => {
		const index = thread.comments.findIndex(_ => _.id === commentId);
		if (index < 0) {
			dispatch(notify(getMessages(locale).noSearchResults))
			console.error(`Comment #${commentId} not found`)
			return
		}
		// `fromIndexRef` is used instead of `fromIndex`
		// to avoid having `fromIndex` in the list of dependencies
		// which would result in re-rendering all comments
		// when a user clicks "Show previous" button.
		const fromIndex = fromIndexRef.current
		if (index < fromIndex) {
			dispatch(notify('Comment not rendered'))
			return
		}
		const { top } = virtualScroller.current.getItemCoordinates(index - fromIndex)
		const headerHeight = document.querySelector('.webpage__header').offsetHeight
		window.scrollTo(0, top - headerHeight)
		if (fromCommentId) {
			const history = commentNavigationHistoryRef.current
			if (history.length > 0 && history[history.length - 1].commentId === fromCommentId) {
				// Don't add sequential idential entries to the history
				// when a user clicks on a `post-link` quote multiple times.
			} else {
				// This turned out to feel inconsistent, so this feature was disabled.
				// // Don't add an entry to the history if the comment with the
				// // `post-link` being clicked is still visible after scrolling
				// // to the quoted comment (with some bottom margin).
				// const fromCommentIndex = thread.comments.findIndex(_ => _.id === fromCommentId);
				// const { top: fromCommentTop } = virtualScroller.current.getItemCoordinates(fromCommentIndex - fromIndex)
				// if (fromCommentTop > top - headerHeight + getViewportHeight() * 0.9) {
					onSetCommentNavigationHistory(history.concat({ commentId: fromCommentId }))
				// }
			}
		}
	},
	// This dependencies list should be such that
	// comments aren't re-rendered when they don't need to.
	// (`itemComponentProps` depends on `scrollToComment`)
	[thread, dispatch, locale])
	const onBackToPreviouslyViewedComment = useCallback(() => {
		const latest = commentNavigationHistory.pop()
		scrollToComment(latest.commentId)
		onSetCommentNavigationHistory(commentNavigationHistory.slice())
	}, [scrollToComment, commentNavigationHistory])
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
		scrollToComment
		// `itemComponentProps` dependencies list should be such
		// that comments aren't re-rendered when they don't need to.
	}), [thread, areAttachmentsExpanded, dispatch, scrollToComment])
	const onBack = useCallback((event) => {
		if (canGoBackInstantly()) {
			dispatch(goBack())
			event.preventDefault()
		}
	}, [dispatch])
	const [showAllInProgress, setShowAllInProgress] = useState()
	const [showAllWillFinish, setShowAllWillFinish] = useState()
	const onShowAll = useCallback(() => {
		setShowAllInProgress(true)
	}, [])
	useEffect(() => {
		if (showAllInProgress) {
			setFromIndex(0)
			setShowAllWillFinish(true)
		}
	}, [showAllInProgress])
	useEffect(() => {
		if (showAllWillFinish) {
			setShowAllInProgress(false)
			setShowAllWillFinish(false)
		}
	}, [showAllWillFinish])
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
		<BoardOrThreadMenu
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
				{!searchQuery && commentNavigationHistory.length > 0 &&
					<React.Fragment>
						<div className="thread-page__back-to-previous-comment-desktop">
							<Button
								onClick={onBackToPreviouslyViewedComment}
								className="thread-page__back-to-previous-comment-desktop-button rrui__button--outline">
								<LeftArrowThick strokeWidth={10} className="thread-page__back-to-previous-comment-desktop__arrow"/>
								{getMessages(locale).backToPreviouslyViewedComment}
							</Button>
						</div>
						<button
							type="button"
							onClick={onBackToPreviouslyViewedComment}
							title={getMessages(locale).backToPreviouslyViewedComment}
							className="rrui__button-reset thread-page__back-to-previous-comment-mobile">
							<LeftArrowThick strokeWidth={4} className="thread-page__back-to-previous-comment-mobile__arrow"/>
						</button>
					</React.Fragment>
				}
				{searchQuery &&
					<ThreadCommentsList
						key="searchResults"/>
				}
				{shownComments.length > 0 && !searchQuery &&
					<ThreadCommentsList
						key="comments"
						ref={virtualScroller}
						getItem={getItem}
						initialState={initialVirtualScrollerState}
						setState={setVirtualScrollerState}
						stateRef={virtualScrollerState}
						scrollPosition={scrollPosition}
						setScrollPosition={setScrollPosition}
						items={shownComments}
						itemComponent={CommentComponent}
						itemComponentProps={itemComponentProps}
						preserveScrollPositionOnPrependItems={showAllInProgress ? false : true}
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
		</section>
	)
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

function getFromIndex(board, thread) {
	const latestReadCommentId = UserData.getLatestReadComments(board.id, thread.id)
	if (latestReadCommentId) {
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

function LeftArrowThick({ className, strokeWidth }) {
	return (
		<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={className}>
			<line stroke="currentColor" strokeWidth={strokeWidth} x1="74.5" y1="2.25" x2="25" y2="51.75"/>
			<line stroke="currentColor" strokeWidth={strokeWidth} x1="74.5" y1="97.75" x2="25" y2="48.25"/>
		</svg>
	)
}

LeftArrowThick.propTypes = {
	strokeWidth: PropTypes.number.isRequired,
	className: PropTypes.string
}

// This is a workaround for cases when `found` doesn't remount
// page component when navigating to the same route.
// https://github.com/4Catalyzer/found/issues/639
export default function ThreadPageWrapper() {
	const board = useSelector(({ chan }) => chan.board)
	const thread = useSelector(({ chan }) => chan.thread)
	return <ThreadPage key={`${board.id}/${thread.id}`}/>
}
ThreadPageWrapper.meta = ThreadPage.meta
ThreadPageWrapper.load = ThreadPage.load