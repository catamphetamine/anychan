import React from 'react'
import PropTypes from 'prop-types'
import {
	goto,
	pushLocation,
	preload,
	meta,
	wasInstantNavigation,
	isInstantBackAbleNavigation
} from 'react-website'
import { connect } from 'react-redux'
import classNames from 'classnames'

import { getThreads, getThread } from '../redux/chan'
import { setVirtualScrollerState, setScrollPosition } from '../redux/board'
import { notify } from 'webapp-frontend/src/redux/notifications'
import { preloadStarted, preloadFinished } from 'webapp-frontend/src/redux/preload'
import { openSlideshow } from 'webapp-frontend/src/redux/slideshow'

import { getChan } from '../chan'
import getMessages from '../messages'
import getUrl from '../utility/getUrl'

import BoardOrThreadMenu from '../components/BoardOrThreadMenu'
import ThreadComment from '../components/ThreadComment'
import VirtualScroller from 'virtual-scroller/react'

import './Board.css'

@meta(({ chan: { board }}) => ({
	title: board && board.name,
	description: board && board.description
}))
@connect(({ app, chan, board }) => ({
	board: chan.board,
	threads: chan.threads,
	settings: app.settings,
	locale: app.settings.locale,
	virtualScrollerState: board.virtualScrollerState,
	scrollPosition: board.scrollPosition
}), {
	setVirtualScrollerState,
	setScrollPosition,
	openSlideshow,
	preloadStarted,
	preloadFinished,
	getThread,
	pushLocation,
	goto,
	notify
})
@preload(async ({ getState, dispatch, params }) => {
	// Must be the same as the code inside `onBoardClick` in `components/Boards.js`.
	await dispatch(getThreads(
		params.board,
		getState().app.settings.censoredWords,
		getState().app.settings.locale
	))
})
export default class BoardPage extends React.Component {
	static propTypes = {
		openSlideshow: PropTypes.func.isRequired,
		locale: PropTypes.string.isRequired
	}

	state = {}

	constructor() {
		super()
		this.onThreadClick = this.onThreadClick.bind(this)
	}

	async onThreadClick(comment, thread, board) {
		const {
			preloadStarted,
			preloadFinished,
			getThread,
			pushLocation,
			notify,
			settings,
			locale
		} = this.props
		try {
			preloadStarted()
			// Must be the same as the code inside `@preload()` in `pages/Thread.js`.
			await getThread(
				board.id,
				thread.id,
				settings.censoredWords,
				locale
			)
			// Won't ever throw because `goto()` doesn't return a `Promise`.
			pushLocation(getUrl(board, thread), { instantBack: true })
		} catch (error) {
			console.error(error)
			notify(getMessages(locale).loadingCommentsError, { type: 'error '})
		} finally {
			preloadFinished()
		}
	}

	setSearchBarShown = (isSearchBarShown) => {
		this.setState({ isSearchBarShown })
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
		const { threads } = this.props
		let i = previousLastSeenItemIndex + 1
		while (i <= newLastSeenItemIndex) {
			threads[i].comments[0].parseContent()
			i++
		}
	}

	componentWillUnmount() {
		if (isInstantBackAbleNavigation()) {
			// Save `virtual-scroller` state in Redux state.
			const {
				setVirtualScrollerState,
				setScrollPosition
			} = this.props
			setVirtualScrollerState(this.virtualScrollerState)
			// Using `window.pageYOffset` instead of `window.scrollY`
			// because `window.scrollY` is not supported by Internet Explorer.
			setScrollPosition(window.pageYOffset)
		}
	}

	render() {
		const {
			board,
			threads,
			openSlideshow,
			notify,
			locale,
			virtualScrollerState
		} = this.props

		const {
			isSearchBarShown
		} = this.state

		const itemComponentProps = {
			mode: 'board',
			board,
			threads,
			onClick: this.onThreadClick,
			openSlideshow,
			notify,
			locale
		}

		return (
			<section className="board-page content text-content">
				<div className="board-page__header">
					<h1 className="page__heading">
						{board.name}
					</h1>
					<BoardOrThreadMenu
						mode="board"
						notify={notify}
						locale={locale}
						isSearchBarShown={isSearchBarShown}
						setSearchBarShown={this.setSearchBarShown}/>
				</div>
				{getChan().id === '2ch' && board.id === 'd' &&
					<p className="board-page__api-bug-note">
						Данный раздел пуст из-за бага в <a href={`https://2ch.hk/${board.id}/catalog.json`} target="_blank">API Двача</a>.
						<br/>
						<a href={`https://2ch.hk/${board.id}`} target="_blank">Перейти на Двач</a>.
					</p>
				}
				<VirtualScroller
					onMount={this.onVirtualScrollerMount}
					onLastSeenItemIndexChange={this.onVirtualScrollerLastSeenItemIndexChange}
					initialState={wasInstantNavigation() ? virtualScrollerState : undefined}
					onStateChange={this.onVirtualScrollerStateChange}
					items={threads}
					itemComponent={CommentComponent}
					itemComponentProps={itemComponentProps}
					className="board-page__threads"/>
			</section>
		)
	}
}

// Rewrote the component as `PureComponent` to optimize
// `<VirtualScroller/>` re-rendering.
class CommentComponent extends React.PureComponent {
	onExpandContent = () => {
		const { onStateChange } = this.props
		onStateChange({
			expandContent: true
		})
	}
	render() {
		const {
			state,
			children: thread,
			board,
			threads,
			...rest
		} = this.props
		const comment = thread.comments[0]
		return (
			<ThreadComment
				key={comment.id}
				comment={comment}
				board={board}
				thread={thread}
				onClickUrl={getUrl(board, thread)}
				initialExpandContent={state && state.expandContent}
				onExpandContent={this.onExpandContent}
				{...rest}/>
		)
	}
}

// function CommentComponent({ children: comment, board, threads, ...rest }) {
// 	// .find() can be slow.
// 	// const thread = threads.find(_ => _.comments[0].id === comment.id)
// 	// `comment.thread` is set for this case specifically in `./src/redux/chan.js`.
// 	const thread = comment.thread
// 	return (
// 		<ThreadComment
// 			key={comment.id}
// 			comment={comment}
// 			board={board}
// 			thread={thread}
// 			onClickUrl={getUrl(board, thread)}
// 			{...rest}/>
// 	)
// }

CommentComponent.propTypes = {
	board: PropTypes.object.isRequired,
	threads: PropTypes.arrayOf(PropTypes.object).isRequired,
	children: PropTypes.object.isRequired
}