import React from 'react'
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

import getUrl from '../utility/getUrl'
import { getThread } from '../redux/chan'
import { setVirtualScrollerState, setScrollPosition } from '../redux/thread'
import { notify } from 'webapp-frontend/src/redux/notifications'
import { openSlideshow } from 'webapp-frontend/src/redux/slideshow'

import BoardOrThreadMenu from '../components/BoardOrThreadMenu'
import ThreadCommentTree from '../components/ThreadCommentTree'
import VirtualScroller from 'virtual-scroller/react'

import openLinkInNewTab from 'webapp-frontend/src/utility/openLinkInNewTab'

import './Thread.css'

@meta(({ chan: { board, thread }}) => ({
	title: thread && thread.subject || board && board.name,
	description: thread && thread.comments[0].textPreview,
	image: thread && getThreadImage(thread)
}))
@connect(({ chan, app, thread }) => ({
	board: chan.board,
	thread: chan.thread,
	locale: app.settings.locale,
	virtualScrollerState: thread.virtualScrollerState,
	scrollPosition: thread.scrollPosition
}), {
	setVirtualScrollerState,
	setScrollPosition,
	openSlideshow,
	notify
})
@preload(async ({ getState, dispatch, params }) => {
	// Must be the same as the code inside `onThreadClick` in `pages/Board.js`.
	await dispatch(getThread(
		params.board,
		params.thread,
		getState().app.settings.filters,
		getState().app.settings.locale
	))
})
export default class ThreadPage extends React.Component {
	static propTypes = {
		openSlideshow: PropTypes.func.isRequired,
		notify: PropTypes.func.isRequired,
		locale: PropTypes.string.isRequired
	}

	state = {}

	virtualScroller = React.createRef()

	setThreadTracked = (isThreadTracked) => {
		this.setState({ isThreadTracked })
	}

	setSearchBarShown = (isSearchBarShown) => {
		this.setState({ isSearchBarShown })
	}

	setAttachmentsExpanded = (areAttachmentsExpanded) => {
		this.setState({ areAttachmentsExpanded })
	}

	openSlideshow = () => {
		const { thread, openSlideshow } = this.props
		const attachments = thread.comments.reduce(
			(attachments, comment) => attachments.concat(comment.attachments || []),
			[]
		)
		openSlideshow(attachments, 0, { slideshowMode: true })
	}

	onVirtualScrollerStateChange = (state) => {
		this.virtualScrollerState = state
	}

	onVirtualScrollerMount = () => {
		if (wasInstantNavigation()) {
			const { scrollPosition } = this.props
			window.scrollTo(0, scrollPosition)
		}
	}

	onVirtualScrollerLastSeenItemIndexChange = (newLastSeenItemIndex, previousLastSeenItemIndex) => {
		const { thread } = this.props
		let i = previousLastSeenItemIndex + 1
		while (i <= newLastSeenItemIndex) {
			thread.comments[i].parseContent()
			i++
		}
	}

	componentWillUnmount() {
		if (isInstantBackAbleNavigation()) {
			const {
				setVirtualScrollerState,
				setScrollPosition
			} = this.props
			setVirtualScrollerState(this.virtualScrollerState)
			// `window.scrollY` is not supported by Internet Explorer.
			setScrollPosition(window.pageYOffset)
		}
	}

	render() {
		const {
			board,
			thread,
			locale,
			openSlideshow,
			virtualScrollerState,
			notify
		} = this.props

		const {
			isThreadTracked,
			isSearchBarShown,
			areAttachmentsExpanded
		} = this.state

		const itemComponentProps = {
			onCommentContentChange: (id) => {
				const index = thread.comments.findIndex(_ => _.id === id)
				this.virtualScroller.current.updateItem(index)
			},
			mode: 'thread',
			board,
			thread,
			openSlideshow,
			notify,
			locale,
			expandAttachments: areAttachmentsExpanded
		}

		// const menu = (
		// 	<ThreadMenu
		// 		locale={locale}
		// 		openSlideshow={this.openSlideshow}
		// 		isThreadTracked={isThreadTracked}
		// 		setThreadTracked={this.setThreadTracked}
		// 		isSearchBarShown={isSearchBarShown}
		// 		setSearchBarShown={this.setSearchBarShown}
		// 		areAttachmentsExpanded={areAttachmentsExpanded}
		// 		setAttachmentsExpanded={this.setAttachmentsExpanded}
		// 		className="board-or-thread-menu board-or-thread-menu--small-screen"/>
		// )

		return (
			<section className={classNames('thread-page', 'content', 'text-content')}>
				{/*
				<header className="thread-page__header page__heading">
					<div className="page__heading-text">
						<Link to={getUrl(board)}>
							{board.name}
						</Link>
					</div>
					<h1 className="page__heading-text">
						{thread.subject}
					</h1>
				</header>
				*/}
				<div className="thread-page__header">
					<BoardOrThreadMenu
						mode="thread"
						smallScreen
						notify={notify}
						locale={locale}
						openSlideshow={this.openSlideshow}
						isThreadTracked={isThreadTracked}
						setThreadTracked={this.setThreadTracked}
						isSearchBarShown={isSearchBarShown}
						setSearchBarShown={this.setSearchBarShown}
						areAttachmentsExpanded={areAttachmentsExpanded}
						setAttachmentsExpanded={this.setAttachmentsExpanded}/>
				</div>
				<BoardOrThreadMenu
					mode="thread"
					notify={notify}
					locale={locale}
					openSlideshow={this.openSlideshow}
					isThreadTracked={isThreadTracked}
					setThreadTracked={this.setThreadTracked}
					isSearchBarShown={isSearchBarShown}
					setSearchBarShown={this.setSearchBarShown}
					areAttachmentsExpanded={areAttachmentsExpanded}
					setAttachmentsExpanded={this.setAttachmentsExpanded}/>
				<VirtualScroller
					ref={this.virtualScroller}
					onMount={this.onVirtualScrollerMount}
					onLastSeenItemIndexChange={this.onVirtualScrollerLastSeenItemIndexChange}
					initialState={wasInstantNavigation() ? virtualScrollerState : undefined}
					onStateChange={this.onVirtualScrollerStateChange}
					items={thread.comments}
					itemComponent={CommentComponent}
					itemComponentProps={itemComponentProps}
					className="thread-page__comments"/>
			</section>
		)
	}
}

function getThreadImage(thread) {
	const comment = thread.comments[0]
	if (comment.attachments && comment.attachments.length > 0) {
		const attachment = comment.attachments[0]
		switch (attachment.type) {
			case 'picture':
				return attachment.picture.url
			case 'video':
				return attachment.video.picture.url
		}
	}
}

// Rewrote the component as `PureComponent` to optimize
// `<VirtualScroller/>` re-rendering.
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

// function CommentComponent({ children: comment, ...rest }) {
// 	return (
// 		<ThreadCommentTree
// 			key={comment.id}
// 			comment={comment}
// 			{...rest}/>
// 	)
// }

CommentComponent.propTypes = {
	children: PropTypes.object.isRequired
}