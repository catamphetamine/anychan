import React from 'react'
import PropTypes from 'prop-types'
import { pushLocation, Link } from 'react-website'
import { connect } from 'react-redux'
import { TextInput, Button } from 'react-responsive-ui'
import classNames from 'classnames'

import { getThreads } from '../redux/chan'
import { notify } from 'webapp-frontend/src/redux/notifications'
import { preloadStarted, preloadFinished } from 'webapp-frontend/src/redux/preload'

import { getChan, addChanParameter } from '../chan'
import getMessages from '../messages'
import getUrl from '../utility/getUrl'

import SearchIcon from 'webapp-frontend/assets/images/icons/menu/search-outline.svg'

import './Boards.css'

@connect(({ app, chan }) => ({
	locale: app.settings.locale,
	selectedBoard: chan.board,
	boards: chan.boards,
	boardsByPopularity: chan.boardsByPopularity,
	boardsByCategory: chan.boardsByCategory
}))
export default class BoardsPanel extends React.Component {
	render() {
		return (
			<Boards {...this.props}/>
		)
	}
}

export class Boards extends React.PureComponent {
	state = {
		view: this.props.boardsByPopularity ? 'default' : (this.props.boardsByCategory ? 'by-category' : 'default')
	}

	onChangeViewAllBoards = () => this.setState({ view: 'default' })
	onChangeViewByCategory = () => this.setState({ view: 'by-category' })

	onSearchQueryChange = (query) => {
		const {
			boards,
			boardsByPopularity
		} = this.props
		query = query.toLowerCase()
		this.setState({
			searchQuery: query,
			filteredBoards: (boards || boardsByPopularity).filter((board) => {
				return (board.name && board.name.toLowerCase().includes(query)) ||
					board.id.toLowerCase().includes(query)
			})
		})
	}

	render() {
		const {
			locale,
			selectedBoard,
			boards,
			boardsByPopularity,
			boardsByCategory,
			showAllBoards,
			darkMode,
			className
		} = this.props

		const {
			view,
			searchQuery,
			filteredBoards
		} = this.state

		if (!boards) {
			return null
		}

		return (
			<nav className={classNames(className, 'boards', {
				'boards--dark': darkMode,
				'boards--all': showAllBoards
			})}>
				{boardsByPopularity && boardsByCategory &&
					<div className="boards__view-switcher">
						<Button
							disabled={view === 'default'}
							onClick={this.onChangeViewAllBoards}
							className={classNames('boards__view-switch', {
								'boards__view-switch--disabled': view === 'default'
							})}>
							{getMessages(locale).boardsByPopularity}
						</Button>

						<Button
							disabled={view === 'by-category'}
							onClick={this.onChangeViewByCategory}
							className={classNames('boards__view-switch', {
								'boards__view-switch--disabled': view === 'by-category'
							})}>
							{getMessages(locale).boardsByCategory}
						</Button>
					</div>
				}

				{showAllBoards && view === 'default' &&
					<TextInput
						type="search"
						icon={SearchIcon}
						placeholder={getMessages(locale).search}
						value={searchQuery}
						onChange={this.onSearchQueryChange}
						className="boards__search"/>
				}

				{showAllBoards && view === 'default' && searchQuery && filteredBoards.length === 0 &&
					<div className="boards__nothing-found">
						{getMessages(locale).noSearchResults}
					</div>
				}

				<div className={classNames('boards-list', {
					'boards-list--default': view === 'default',
					'boards-list--by-category': view === 'by-category'
				})}>
					{view === 'by-category' && boardsByCategory.map((category, i) => (
						<React.Fragment key={category.category || '—'}>
							<div className="boards-list-section__pre-title"/>
							<h2 className={classNames('boards-list-section__title', {
								'boards-list-section__title--first': i === 0
							})}>
								{category.category}
							</h2>
							{category.boards.map((board) => (
								<Board
									key={board.id}
									board={board}
									isSelected={selectedBoard && board.id === selectedBoard.id}/>
							))}
						</React.Fragment>
					))}
					{view === 'default' && (filteredBoards || boardsByPopularity || boards).filter(board => showAllBoards || !board.isHidden).map((board) => (
						<Board
							key={board.id}
							isSelected={selectedBoard && board.id === selectedBoard.id}
							board={board}/>
					))}
				</div>

				{!showAllBoards && (getChan().allBoardsUrl || getChan().hideBoardCategories) &&
					<div className="boards__show-all-wrapper">
						<Link to={addChanParameter('/boards')} className="boards__show-all">
							{getMessages(locale).boards.showAll}
						</Link>
					</div>
				}
			</nav>
		)
	}
}

const boardShape = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	commentsPerHour: PropTypes.number
}

Boards.propTypes = {
	selectedBoard: PropTypes.shape(boardShape),
	boards: PropTypes.arrayOf(PropTypes.shape(boardShape)),
	boardsByCategory: PropTypes.arrayOf(PropTypes.shape({
		category: PropTypes.string.isRequired,
		boards: PropTypes.arrayOf(PropTypes.shape(boardShape)).isRequired
	})),
	showAllBoards: PropTypes.bool,
	darkMode: PropTypes.bool,
	className: PropTypes.string
}

@connect(({ app }) => ({
	settings: app.settings
}), {
	preloadStarted,
	preloadFinished,
	getThreads,
	pushLocation,
	notify
})
class Board extends React.Component {
	state = {}

	constructor() {
		super()
		this.onBoardClick = this.onBoardClick.bind(this)
	}

	async onBoardClick(event) {
		event.preventDefault()
		const {
			preloadStarted,
			preloadFinished,
			board,
			settings,
			pushLocation,
			getThreads,
			notify
		} = this.props
		try {
			preloadStarted()
			// Must be the same as the code inside `@preload()` in `pages/Board.js`.
			await getThreads(
				board.id,
				settings.filters,
				settings.locale
			)
			pushLocation(getUrl(board))
		} catch (error) {
			console.error(error)
			notify(getMessages(settings.locale).loadingThreadsError, { type: 'error '})
		} finally {
			preloadFinished()
		}
	}

	onPointerEnter = () => {
		this.setState({
			isHovered: true
		})
	}

	// https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/pointerout_event
	// The pointerout event is fired for several reasons including:
	// * pointing device is moved out of the hit test boundaries of an element (`pointerleave`);
	// * firing the pointerup event for a device that does not support hover (see `pointerup`);
	// * after firing the pointercancel event (see `pointercancel`);
	// * when a pen stylus leaves the hover range detectable by the digitizer.
	onPointerOut = () => {
		this.setState({
			isHovered: false,
			isActive: false
		})
	}

	onPointerDown = () => {
		this.setState({
			isActive: true
		})
	}

	onPointerUp = () => {
		this.setState({
			isActive: false
		})
	}

	render() {
		const {
			board,
			isSelected
		} = this.props

		const {
			isHovered,
			isActive
		} = this.state

		// Safari doesn't support pointer events.
		// https://caniuse.com/#feat=pointer
		// https://webkit.org/status/#?search=pointer%20events
		// onPointerDown={this.onPointerDown}
		// onPointerUp={this.onPointerUp}
		// onPointerEnter={this.onPointerEnter}
		// onPointerOut={this.onPointerOut}

		return (
			<React.Fragment>
				<Link
					to={getUrl(board)}
					tabIndex={-1}
					onDragStart={this.onPointerOut}
					onClick={this.onBoardClick}
					onMouseDown={this.onPointerDown}
					onMouseUp={this.onPointerUp}
					onMouseEnter={this.onPointerEnter}
					onMouseLeave={this.onPointerOut}
					className={classNames('boards-list__board-url', {
						'boards-list__board-url--selected': isSelected,
						'boards-list__board-url--hover': isHovered,
						'boards-list__board-url--active': isActive
					})}>
					{board.id}
				</Link>
				<Link
					to={getUrl(board)}
					onDragStart={this.onPointerOut}
					onClick={this.onBoardClick}
					onMouseDown={this.onPointerDown}
					onMouseUp={this.onPointerUp}
					onMouseEnter={this.onPointerEnter}
					onMouseLeave={this.onPointerOut}
					className={classNames('boards-list__board-name', {
						'boards-list__board-name--selected': isSelected,
						'boards-list__board-name--hover': isHovered,
						'boards-list__board-name--active': isActive
					})}>
					{board.name}
				</Link>
			</React.Fragment>
		)
	}
}

Board.propTypes = {
	board: PropTypes.shape(boardShape).isRequired,
	isSelected: PropTypes.bool
}