import React from 'react'
import PropTypes from 'prop-types'
import { pushLocation, Link } from 'react-website'
import { connect } from 'react-redux'
import { Button } from 'react-responsive-ui'
import classNames from 'classnames'

import { getThreads } from '../redux/chan'
import { notify } from 'webapp-frontend/src/redux/notifications'
import { preloadStarted, preloadFinished } from 'webapp-frontend/src/redux/preload'

import getMessages from '../messages'
import { isBoardLocation, isThreadLocation } from '../utility/routes'
import getUrl from '../utility/getUrl'

import './Boards.css'

@connect(({ app, chan }) => ({
	locale: app.settings.locale,
	selectedBoard: chan.board,
	boards: chan.boards,
	boardsByPopularity: chan.boardsByPopularity,
	boardsByCategory: chan.boardsByCategory
}))
export default class Boards extends React.Component {
	state = {
		view: this.props.boardsByPopularity ? 'default' : 'by-category'
	}

	onChangeViewAllBoards = () => this.setState({ view: 'default' })
	onChangeViewByCategory = () => this.setState({ view: 'by-category' })

	render() {
		const {
			locale,
			selectedBoard,
			boards,
			boardsByPopularity,
			boardsByCategory,
			className
		} = this.props

		const { view } = this.state

		if (!boards) {
			return null
		}

		return (
			<nav className={classNames('boards', 'boards--dark', className)}>
				{boardsByPopularity && boardsByCategory &&
					<div className="boards__view-switcher">
						<Button
							onClick={this.onChangeViewAllBoards}
							className={classNames('boards__view-switch', {
								'boards__view-switch--selected': view === 'default'
							})}>
							{boardsByPopularity ? getMessages(locale).boardsByPopularity : getMessages(locale).boardsList}
						</Button>

						<div className="boards__view-switch-divider"/>

						<Button
							onClick={this.onChangeViewByCategory}
							className={classNames('boards__view-switch', {
								'boards__view-switch--selected': view === 'by-category'
							})}>
							{getMessages(locale).boardsByCategory}
						</Button>
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
					{view === 'default' && boardsByPopularity.filter(board => !board.isHidden).map((board) => (
						<Board
							key={board.id}
							isSelected={selectedBoard && board.id === selectedBoard.id}
							board={board}/>
					))}
				</div>
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
	expanded: PropTypes.bool.isRequired,
	selectedBoard: PropTypes.shape(boardShape),
	boards: PropTypes.arrayOf(PropTypes.shape(boardShape)),
	boardsByCategory: PropTypes.arrayOf(PropTypes.shape({
		category: PropTypes.string.isRequired,
		boards: PropTypes.arrayOf(PropTypes.shape(boardShape)).isRequired
	})),
	className: PropTypes.string
}

Boards.defaultProps = {
	expanded: false
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

	onPointerLeave = () => {
		this.setState({
			isHovered: false
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

		// `onPointerOut` includes `onPointerCancel`.
		// https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/pointerout_event

		return (
			<React.Fragment>
				<Link
					to={getUrl(board)}
					onClick={this.onBoardClick}
					onPointerDown={this.onPointerDown}
					onPointerUp={this.onPointerUp}
					onPointerEnter={this.onPointerEnter}
					onPointerLeave={this.onPointerLeave}
					onPointerOut={this.onPointerUp}
					className={classNames('boards-list__board-url', {
						'boards-list__board-url--selected': isSelected,
						'boards-list__board-url--hover': isHovered,
						'boards-list__board-url--active': isActive
					})}>
					{board.id}
				</Link>
				<Link
					to={getUrl(board)}
					onClick={this.onBoardClick}
					onPointerDown={this.onPointerDown}
					onPointerUp={this.onPointerUp}
					onPointerEnter={this.onPointerEnter}
					onPointerLeave={this.onPointerLeave}
					onPointerOut={this.onPointerUp}
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