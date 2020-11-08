import React from 'react'
import { Link } from 'react-pages'
import { useSelector } from 'react-redux'

import BoardUrl from '../BoardUrl'

import {
	isBoardLocation,
	isThreadLocation
} from '../../utility/routes'

import getUrl from '../../utility/getUrl'

import './BoardOrThreadTitle.css'

export default function BoardOrThreadTitle() {
	const board = useSelector(({ chan }) => chan.board)
	const thread = useSelector(({ chan }) => chan.thread)
	const route = useSelector(({ found }) => found.resolvedMatch)
	const isBoardOrThreadPage = (isBoardLocation(route) || isThreadLocation(route)) && board
	const isThreadPage = isThreadLocation(route) && thread
	if (isBoardOrThreadPage) {
		return (
			<div className="BoardOrThreadTitle">
				<Link
					to={getUrl(board)}
					className="BoardOrThreadTitle-board">
					<BoardUrl boardId={board.id}/>
				</Link>
				{isThreadPage &&
					<div className="BoardOrThreadTitle-thread">
						{thread.title}
					</div>
				}
			</div>
		)
	}
	return null
}