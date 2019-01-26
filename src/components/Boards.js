import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-website'
import { connect } from 'react-redux'
import { Button } from 'react-responsive-ui'
import classNames from 'classnames'

import './Boards.css'

@connect(({ chan }) => ({
	boardsBySpeed: chan.boardsBySpeed,
	boardsByCategory: chan.boardsByCategory
}))
export default class Boards extends React.Component {
	state = {
		view: 'by-speed'
	}

	onChangeViewBySpeed = () => this.setState({ view: 'by-speed' })
	onChangeViewByCategory = () => this.setState({ view: 'by-category' })

	render() {
		const {
			boardsBySpeed,
			boardsByCategory,
			onBoardClick
		} = this.props

		const { view } = this.state

		if (!boardsBySpeed) {
			return null
		}

		return (
			<section className="boards">
				<div className="boards__view-switcher">
					<Button
						onClick={this.onChangeViewBySpeed}
						className={classNames('boards__view-switch', {
							'boards__view-switch--selected': view === 'by-speed'
						})}>
						Популярные
					</Button>

					<div className="boards__view-switch-divider"/>

					<Button
						onClick={this.onChangeViewByCategory}
						className={classNames('boards__view-switch', {
							'boards__view-switch--selected': view === 'by-category'
						})}>
						По разделам
					</Button>
				</div>

				<table className={classNames('boards-list', {
					'boards-list--by-speed': view === 'by-speed'
				})}>
					<tbody>
						{view === 'by-category' && boardsByCategory.map((category, i) => (
							<React.Fragment key={category.category}>
								<tr>
									<td/>
									<td>
										<h2 className={classNames('boards-list-section__title', {
											'boards-list-section__title--first': i === 0
										})}>
											{category.category}
										</h2>
									</td>
								</tr>
								{category.boards.map((board) => (
									<Board
										key={board.id}
										board={board}
										onClick={onBoardClick}/>
								))}
							</React.Fragment>
						))}
						{view === 'by-speed' && boardsBySpeed.map((board) => (
							<Board
								key={board.id}
								board={board}
								onClick={onBoardClick}/>
						))}
					</tbody>
				</table>
			</section>
		)
	}
}

const boardShape = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	info: PropTypes.string,
	speed: PropTypes.number.isRequired
}

Boards.propTypes = {
	expanded: PropTypes.bool.isRequired,
	boardsBySpeed: PropTypes.arrayOf(PropTypes.shape({
		...boardShape,
		category: PropTypes.string.isRequired
	})),
	boardsByCategory: PropTypes.arrayOf(PropTypes.shape({
		category: PropTypes.string.isRequired,
		boards: PropTypes.arrayOf(PropTypes.shape(boardShape)).isRequired
	})),
	onBoardClick: PropTypes.func
}

Boards.defaultProps = {
	expanded: false
}

class Board extends React.Component {
	onClick = (event) => {
		const { board, onClick } = this.props
		if (onClick) {
			onClick(board.id)
			event.preventDefault()
		}
	}

	render() {
		const { board } = this.props
		return (
			<tr
				key={board.id}
				className="boards-list__board-row"
				title={board.info || board.name}>
				<td className="boards-list__board-container">
					<Link
						to={`https://2ch.hk/${board.id}`}
						onClick={this.onClick}
						className="boards-list__board-url">
						{board.id}
					</Link>
				</td>
				<td>
					<Link
						to={`https://2ch.hk/${board.id}`}
						onClick={this.onClick}
						className="boards-list__board-name">
						{board.name}
					</Link>
				</td>
			</tr>
		)
	}
}

Board.propTypes = {
	boards: PropTypes.shape(boardShape),
	onClick: PropTypes.func
}