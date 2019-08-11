import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
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
import updateAttachmentThumbnailMaxSize from '../utility/updateAttachmentThumbnailMaxSize'

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
	locale: app.settings.locale,
	censoredWords: app.settings.censoredWords,
	virtualScrollerState: board.virtualScrollerState,
	scrollPosition: board.scrollPosition
}), dispatch => ({ dispatch }))
@preload(async ({ getState, dispatch, params }) => {
	// Must be the same as the code inside `onBoardClick` in `components/Boards.js`.
	await dispatch(getThreads(
		params.board,
		getState().app.settings.censoredWords,
		getState().app.settings.locale
	))
})
export default class BoardPage_ extends React.Component {
	render() {
		return <BoardPage {...this.props}/>
	}
}

function BoardPage({
	board,
	threads,
	locale,
	censoredWords,
	virtualScrollerState: initialVirtualScrollerState,
	scrollPosition,
	dispatch
}) {
	const [isSearchBarShown, setSearchBarShown] = useState()
	const virtualScrollerState = useRef()
	const onThreadClick = useCallback(async (comment, thread, board) => {
		try {
			dispatch(preloadStarted())
			// Must be the same as the code inside `@preload()` in `pages/Thread.js`.
			await dispatch(getThread(
				board.id,
				thread.id,
				censoredWords,
				locale
			))
			// Won't ever throw because `goto()` doesn't return a `Promise`.
			dispatch(pushLocation(getUrl(board, thread), { instantBack: true }))
		} catch (error) {
			console.error(error)
			dispatch(notify(getMessages(locale).loadingCommentsError, { type: 'error' }))
		} finally {
			dispatch(preloadFinished())
		}
	}, [dispatch, censoredWords, locale])
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
		(i) => threads[i].comments[0].parseContent(),
		[threads]
	)
	// Runs only once before the initial render.
	// Sets `--PostThumbnail-maxWidth` CSS variable.
	useMemo(
		() => updateAttachmentThumbnailMaxSize(threads.map(thread => thread.comments[0])),
		[threads]
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
	const itemComponentProps = useMemo(() => ({
		mode: 'board',
		board,
		threads,
		onClick: onThreadClick,
		openSlideshow: (...args) => dispatch(openSlideshow.apply(this, args)),
		notify: (...args) => dispatch(notify.apply(this, args)),
		locale
	}), [threads, dispatch])
	return (
		<section className="board-page content">
			<div className="board-page__header">
				<h1 className="page__heading">
					{board.name}
				</h1>
				<BoardOrThreadMenu
					mode="board"
					notify={(...args) => dispatch(notify(...args))}
					locale={locale}
					isSearchBarShown={isSearchBarShown}
					setSearchBarShown={setSearchBarShown}/>
			</div>
			{getChan().id === '2ch' && board.id === 'd' &&
				<p className="board-page__api-bug-note">
					Данный раздел пуст из-за бага в <a href={`https://2ch.hk/${board.id}/catalog.json`} target="_blank">API Двача</a>.
					<br/>
					<a href={`https://2ch.hk/${board.id}`} target="_blank">Перейти на Двач</a>.
				</p>
			}
			<VirtualScroller
				onMount={onVirtualScrollerMount}
				onItemFirstRender={onItemFirstRender}
				initialState={wasInstantNavigation() ? initialVirtualScrollerState : undefined}
				onStateChange={onVirtualScrollerStateChange}
				items={threads}
				itemComponent={CommentComponent}
				itemComponentProps={itemComponentProps}
				className="board-page__threads"/>
		</section>
	)
}

function CommentComponent({
	state,
	children: thread,
	board,
	threads,
	onStateChange,
	...rest
}) {
	const onExpandContent = useCallback(() => {
		onStateChange({
			expandContent: true
		})
	}, [onStateChange])
	const comment = thread.comments[0]
	// Passing `initialExpandContent` and `onExpandContent` explicitly
	// because it doesn't use `<ThreadCommentTree/>` that passes
	// those properties automatically.
	return (
		<ThreadComment
			key={comment.id}
			comment={comment}
			board={board}
			thread={thread}
			onClickUrl={getUrl(board, thread)}
			initialExpandContent={state && state.expandContent}
			onExpandContent={onExpandContent}
			onStateChange={onStateChange}
			{...rest}/>
	)
}

CommentComponent.propTypes = {
	board: PropTypes.object.isRequired,
	threads: PropTypes.arrayOf(PropTypes.object).isRequired,
	children: PropTypes.object.isRequired
}

// Using `React.memo()` so that `virtual-scroller`
// doesn't re-render items as the user scrolls.
CommentComponent = React.memo(CommentComponent)