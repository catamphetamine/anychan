import React from 'react'
import PropTypes from 'prop-types'
import { goto, preload, meta } from 'react-website'
import { connect } from 'react-redux'
import classNames from 'classnames'

import { selectBoard, getThreads } from '../redux/chan'

import Boards from '../components/Boards'
import { postOnClickFilter } from './Thread'

import Post from 'webapp-frontend/src/components/Post'
import OnClick from 'webapp-frontend/src/components/OnClick'

import {
	ContentSection,
	ContentSectionHeader
} from 'webapp-frontend/src/components/ContentSection'

import './Board.css'

@meta((state) => ({
	title       : state.chan.board && state.chan.board.name,
	description : state.chan.board && state.chan.board.description
}))
@connect(({ chan }) => ({
	board: chan.board,
	threads: chan.threads,
}))
@preload(async ({ getState, dispatch, params }) => {
	await dispatch(getThreads(params.board, 1, getState().account.settings.filters))
	dispatch(selectBoard(params.board))
})
export default class BoardPage extends React.Component {
	render() {
		const { threads } = this.props
		return (
			<section className="container">
				<div className="row row--align-top">
					<div className="col-3 col-xs-12">
						<ContentSection>
							<Boards/>
						</ContentSection>
					</div>
					<div className="col-9 col-xs-12 col--padding-left-xs">
						{threads && threads.map((thread, i) => <Thread key={i} thread={thread}/>)}
					</div>
				</div>
			</section>
		)
	}
}

@connect(() => ({}), {
	goto
})
class Thread extends React.Component {
	onClick = () => {
		const { goto, thread } = this.props
		goto(`/${thread.board}/${thread.id}`, { instantBack: true })
	}

	render() {
		const { thread } = this.props

		if (!thread) {
			return null
		}

		return (
			<OnClick
				key={thread.id}
				filter={postOnClickFilter}
				onClick={this.onClick}
				onClickClassName="threads__thread-container--click"
				className="threads__thread-container">
				<ContentSection
					key={thread.id}
					className={classNames('threads__thread', {
						'threads__thread--with-subject': thread.posts[0].subject
					})}>
					{thread.posts[0].subject &&
						<ContentSectionHeader>
							{thread.posts[0].subject}
						</ContentSectionHeader>
					}
					<Post
						post={thread.posts[0]}
						saveBandwidth
						expandFirstPictureOrVideo={false}
						attachmentThumbnailHeight={160} />
				</ContentSection>
			</OnClick>
		)
	}
}

Thread.propTypes = {
	thread: PropTypes.shape({
		id: PropTypes.string.isRequired,
		board: PropTypes.string.isRequired,
		posts: PropTypes.arrayOf(PropTypes.shape({
			subject: PropTypes.string
		}))
	})
}