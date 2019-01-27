import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classNames from 'classnames'

import './BoardTitle.css'

@connect(({ chan }) => ({
	board: chan.board
}))
export default class BoardTitle extends React.Component {
	render() {
		const {
			board
		} = this.props

		if (!board) {
			return null
		}

		return (
			<h1 className="board-title">
				{board.name}
			</h1>
		)
	}
}