import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'

import {
	preload,
	meta,
	Link,
	wasInstantNavigation,
	isInstantBackAbleNavigation
} from 'react-website'

import { connect } from 'react-redux'
import classNames from 'classnames'
import VirtualScroller from 'virtual-scroller/react'

import { setVirtualScrollerState, setScrollPosition, isThreadTracked } from '../redux/thread'
import { getThread } from '../redux/chan'
import { trackThread, untrackThread, threadExpired } from '../redux/threadTracker'
import { notify } from 'webapp-frontend/src/redux/notifications'
import { openSlideshow } from 'webapp-frontend/src/redux/slideshow'

import getUrl from '../utility/getUrl'
import updateAttachmentThumbnailMaxSize from '../utility/updateAttachmentThumbnailMaxSize'
import openLinkInNewTab from 'webapp-frontend/src/utility/openLinkInNewTab'
import { hasAttachmentPicture, getThumbnailSize } from 'webapp-frontend/src/utility/post/attachment'

import BoardOrThreadMenu from '../components/BoardOrThreadMenu'
import ThreadCommentTree from '../components/ThreadCommentTree'
import { isSlideSupported } from 'webapp-frontend/src/components/Slideshow'

import './Thread.css'

@meta(({ chan: { board, thread }}) => ({
	title: thread && thread.title || board && board.title,
	description: thread && thread.comments[0].textPreview,
	image: thread && getThreadImage(thread)
}))
@connect(({ chan, app, thread }) => ({
	board: chan.board,
	thread: chan.thread,
	locale: app.settings.locale,
	isThreadTracked: thread.isTracked,
	virtualScrollerState: thread.virtualScrollerState,
	scrollPosition: thread.scrollPosition
}), dispatch => ({ dispatch }))
@preload(async ({ getState, dispatch, params }) => {
	const boardId = params.board
	const threadId = parseInt(params.thread)
	try {
		await dispatch(getThread(
			boardId,
			threadId,
			getState().app.settings.censoredWords,
			getState().app.settings.locale
		))
		dispatch(isThreadTracked(
			boardId,
			threadId
		))
	} catch (error) {
		if (error.status === 404) {
			// Clear expired thread from user data.
			dispatch(threadExpired(boardId, threadId))
		}
		throw error
	}
})
export default class ThreadPage_ extends React.Component {
	render() {
		return <ThreadPage {...this.props}/>
	}
}

function ThreadPage({
	board,
	thread,
	locale,
	virtualScrollerState: initialVirtualScrollerState,
	scrollPosition,
	isThreadTracked,
	dispatch
}) {
	const [areAttachmentsExpanded, setAttachmentsExpanded] = useState()
	const [isSearchBarShown, setSearchBarShown] = useState()
	const virtualScroller = useRef()
	const virtualScrollerState = useRef()
	const openThreadWideSlideshow = useCallback(() => {
		const attachments = thread.comments.reduce(
			(attachments, comment) => attachments.concat(comment.attachments || []),
			[]
		).filter(isSlideSupported)
		dispatch(openSlideshow(attachments, 0, { slideshowMode: true }))
	}, [thread, dispatch])
	const onVirtualScrollerStateChange = useCallback(
		state => virtualScrollerState.current = state,
		[]
	)
	const onVirtualScrollerMount = useCallback(() => {
		if (wasInstantNavigation()) {
			window.scrollTo(0, scrollPosition)
		}
	}, [])
	const onItemFirstRender = useCallback(
		(i) => thread.comments[i].parseContent(),
		[thread]
	)
	// Runs only once before the initial render.
	// Sets `--PostThumbnail-maxWidth` CSS variable.
	useMemo(
		() => updateAttachmentThumbnailMaxSize(thread.comments),
		[thread]
	)
	useEffect(() => {
		return () => {
			if (isInstantBackAbleNavigation()) {
				// Save `virtual-scroller` state in Redux state.
				dispatch(setVirtualScrollerState(virtualScrollerState.current))
				// Using `window.pageYOffset` instead of `window.scrollY`
				// because `window.scrollY` is not supported by Internet Explorer.
				dispatch(setScrollPosition(window.pageYOffset))
			}
		}
	}, [])
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
	const itemComponentProps = useMemo(() => ({
		// `updateLinkedPost()` is passed to `<Post/>`.
		// It's called whenever there's a parent comment who's `content` did change
		// (YouTube video links get loaded, Twitter links get loaded, etc) and there're "replies"
		// to that parent comment having "autogenerated" quotes of that parent comment `content`.
		// So when the parent comment `content` is re-rendered all its "replies" should be
		// re-rendered too and that's what this function is for: it's called for each reply
		// of a post who's `content` did change.
		updateLinkedPost(id) {
			const index = thread.comments.findIndex(_ => _.id === id)
			virtualScroller.current.updateItem(index)
		},
		mode: 'thread',
		board,
		thread,
		openSlideshow: (...args) => dispatch(openSlideshow.apply(this, args)),
		notify: (...args) => dispatch(notify.apply(this, args)),
		locale,
		expandAttachments: areAttachmentsExpanded
	}), [thread, areAttachmentsExpanded, dispatch])
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
				<BoardOrThreadMenu
					mode="thread"
					notify={(...args) => dispatch(notify(...args))}
					locale={locale}
					openSlideshow={openThreadWideSlideshow}
					isThreadTracked={isThreadTracked}
					setThreadTracked={onSetThreadTracked}
					isSearchBarShown={isSearchBarShown}
					setSearchBarShown={setSearchBarShown}
					areAttachmentsExpanded={areAttachmentsExpanded}
					setAttachmentsExpanded={setAttachmentsExpanded}/>
			</div>
			<VirtualScroller
				ref={virtualScroller}
				onMount={onVirtualScrollerMount}
				onItemFirstRender={onItemFirstRender}
				initialState={wasInstantNavigation() ? initialVirtualScrollerState : undefined}
				onStateChange={onVirtualScrollerStateChange}
				items={thread.comments}
				itemComponent={CommentComponent}
				itemComponentProps={itemComponentProps}
				className="thread-page__comments"/>
		</section>
	)
}

ThreadPage.propTypes = {
	board: PropTypes.object.isRequired,
	thread: PropTypes.object.isRequired,
	locale: PropTypes.string.isRequired,
	virtualScrollerState: PropTypes.object,
	scrollPosition: PropTypes.number,
	isThreadTracked: PropTypes.bool,
	dispatch: PropTypes.func.isRequired
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
// in order for `.updateItem(i)` to be able to be called.
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