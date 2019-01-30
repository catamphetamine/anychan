import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-website'
import { connect } from 'react-redux'
import { Button } from 'react-responsive-ui'
import classNames from 'classnames'

import {
	ContentSection
} from 'webapp-frontend/src/components/ContentSection'

import './Boards.css'

@connect(({ chan }) => ({
	boardsBySpeed: chan.boardsBySpeed,
	boardsByCategory: chan.boardsByCategory
}))
class Boards extends React.Component {
	state = {
		view: 'by-speed'
	}

	onChangeViewBySpeed = () => this.setState({ view: 'by-speed' })
	onChangeViewByCategory = () => this.setState({ view: 'by-category' })

	render() {
		const {
			boardsBySpeed,
			boardsByCategory
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
										board={board}/>
								))}
							</React.Fragment>
						))}
						{view === 'by-speed' && boardsBySpeed.map((board) => (
							<Board
								key={board.id}
								board={board}/>
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
	}))
}

Boards.defaultProps = {
	expanded: false
}

class Board extends React.Component {
	render() {
		const { board } = this.props
		return (
			<tr
				key={board.id}
				className="boards-list__board-row"
				title={board.info || board.name}>
				<td className="boards-list__board-container">
					<Link
						to={`/${board.id}`}
						className="boards-list__board-url">
						{board.id}
					</Link>
				</td>
				<td className="boards-list__board-name-container">
					<Link
						to={`/${board.id}`}
						className="boards-list__board-name">
						{board.name}
					</Link>
				</td>
			</tr>
		)
	}
}

Board.propTypes = {
	boards: PropTypes.shape(boardShape)
}

function isBoardLocation({ location, params }) {
	return params.board
}

function isThreadLocation({ location, params }) {
	return params.thread
}

@connect(({ found }) => ({
  route: found.resolvedMatch
}))
export default class BoardsComponent extends React.Component {
	state = {
		isExpanded: undefined
	}

	toggleBoardsList = (event) => {
		this.setState({
			isExpanded: !this.state.isExpanded
		})
	}

	render() {
		const { route } = this.props
		let { isExpanded } = this.state
		if (isExpanded === undefined) {
			if (isBoardLocation(route) || isThreadLocation(route)) {
				isExpanded = false
			} else {
				isExpanded = true
			}
		}
		return (
			<div>
				<div className={classNames('boards__toggle-wrapper', {
					'boards__toggle-wrapper--collapse-boards-list-on-small-screens': !isExpanded
				})}>
					<button
						onClick={this.toggleBoardsList}
						className="boards__toggle rrui__button-reset">
						Показать список досок
					</button>
				</div>
				<ContentSection className={classNames({
					'boards__container--collapse-boards-list-on-small-screens': !isExpanded
				})}>
					<Boards/>
				</ContentSection>
			</div>
		)
	}
}