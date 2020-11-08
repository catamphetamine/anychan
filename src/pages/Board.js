import React, { useState, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { goto, wasInstantNavigation } from 'react-pages'
import { useSelector, useDispatch } from 'react-redux'
import classNames from 'classnames'

import { getThreads } from '../redux/chan'
import { addFavoriteBoard } from '../redux/favoriteBoards'
import { setVirtualScrollerState } from '../redux/board'

import { getChanId } from '../chan'
import getMessages from '../messages'
import getUrl from '../utility/getUrl'
import { updateAttachmentThumbnailMaxSize } from '../utility/postThumbnail'

import BoardThreadMenu from '../components/BoardThreadMenu'
import Comment from '../components/Comment/CommentWrapped'
import CommentsList from '../components/CommentsList'

import './Board.css'

function BoardPage() {
	const board = useSelector(({ chan }) => chan.board)
	const threads = useSelector(({ chan }) => chan.threads)
	const locale = useSelector(({ settings }) => settings.settings.locale)
	const censoredWords = useSelector(({ settings }) => settings.settings.censoredWords)
	const _restoredVirtualScrollerState = useSelector(({ board }) => board.virtualScrollerState)
	const restoredVirtualScrollerState = wasInstantNavigation() ? _restoredVirtualScrollerState : undefined
	const dispatch = useDispatch()
	const [isSearchBarShown, setSearchBarShown] = useState()
	const onThreadClick = useCallback(async (comment, thread, board) => {
		// The only reason the navigation is done programmatically via `goto()`
		// is because a thread card can't be a `<Link/>` because
		// "<a> cannot appear as a descendant of <a>".
		dispatch(goto(getUrl(board, thread), { instantBack: true }))
	}, [dispatch])
	// Runs only once before the initial render.
	// Sets `--PostThumbnail-maxWidth` CSS variable.
	// Not using `useEffect()` because it would run after render, not before it.
	useMemo(
		() => updateAttachmentThumbnailMaxSize(threads.map(thread => thread.comments[0])),
		[threads]
	)
	const itemComponentProps = useMemo(() => ({
		mode: 'board',
		board,
		threads,
		onClick: onThreadClick,
		dispatch,
		locale
	}), [board, threads, dispatch, locale, onThreadClick])
	return (
		<section className="BoardPage Content">
			<header className="BoardPage-header">
				<h1 className="BoardPage-heading">
					{board.title}
				</h1>
				<BoardThreadMenu
					mode="board"
					dispatch={dispatch}
					locale={locale}
					isSearchBarShown={isSearchBarShown}
					setSearchBarShown={setSearchBarShown}
					className="BoardPage-menu"/>
			</header>
			{getChanId() === '2ch' && board.id === 'd' &&
				<p className="BoardPage-apiBoardEmptyNoteTwoChannel">
					Данный раздел пуст из-за бага в <a href={`https://2ch.hk/${board.id}/catalog.json`} target="_blank">API Двача</a>.
					<br/>
					<a href={`https://2ch.hk/${board.id}`} target="_blank">Перейти на Двач</a>.
				</p>
			}
			<CommentsList
				mode="board"
				getComment={getComment}
				restoredState={restoredVirtualScrollerState}
				setState={setVirtualScrollerState}
				items={threads}
				itemComponent={CommentComponent}
				itemComponentProps={itemComponentProps}
				className="Comments BoardPage-threads"/>
		</section>
	)
	// className="BoardPage-threads no-margin-collapse"
}

// BoardPage.propTypes = {
// 	board: PropTypes.string.isRequired,
// 	threads: PropTypes.arrayOf(PropTypes.object).isRequired,
// 	locale: PropTypes.string.isRequired,
// 	censoredWords: PropTypes.arrayOf(PropTypes.object),
// 	virtualScrollerState: PropTypes.object,
// 	dispatch: PropTypes.func.isRequired
// }

BoardPage.meta = ({ chan: { board }}) => ({
	title: board && ('/' + board.id + '/' + ' — ' + board.title),
	description: board && board.description
})

BoardPage.load = async ({ getState, dispatch, params }) => {
	const settings = getState().settings.settings
	await dispatch(getThreads(params.board, {
		censoredWords: settings.censoredWords,
		locale: settings.locale
	}))
	if (settings.autoSuggestFavoriteBoards !== false) {
		const board = getState().chan.board
		dispatch(addFavoriteBoard({
			id: board.id,
			title: board.title
		}))
	}
}

function getComment(thread) {
	return thread.comments[0]
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
	// because it doesn't use `<CommentTree/>` that passes
	// those properties automatically.
	return (
		<Comment
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

// This is a workaround for cases when navigating from one board
// to another board in order to prevent page state inconsistencies
// while the current board data is being updated in Redux
// as the "next" page is being loaded.
// https://github.com/4Catalyzer/found/issues/639#issuecomment-567650811
// https://gitlab.com/catamphetamine/react-pages#same-route-navigation
export default function BoardPageWrapper() {
	const board = useSelector(({ chan }) => chan.board)
	return <BoardPage key={board.id}/>
}
BoardPageWrapper.meta = BoardPage.meta
BoardPageWrapper.load = BoardPage.load