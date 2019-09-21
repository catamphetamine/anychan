import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-website'
import classNames from 'classnames'

import ListButton from './ListButton'
import BoardUrl from './BoardUrl'

import getMessages from '../messages'
import getUrl from '../utility/getUrl'
import { isThreadLocation } from '../utility/routes'
import { untrackThread } from '../redux/threadTracker'
import { trackedThread, board, thread } from '../PropTypes'

import Picture from 'webapp-frontend/src/components/Picture'

import './TrackedThreads.css'

@connect(({ found, app, threadTracker, chan }) => ({
	isThreadLocation: isThreadLocation(found.resolvedMatch),
	locale: app.settings.locale,
	trackedThreads: threadTracker.trackedThreads,
	selectedBoard: chan.board,
	selectedThread: chan.thread
}), dispatch => ({ dispatch }))
export default class TrackedThreads_ extends React.Component {
	render() {
		return <TrackedThreads {...this.props}/>
	}
}

function TrackedThreads({
	isThreadLocation,
	locale,
	trackedThreads,
	selectedBoard,
	selectedThread,
	dispatch
}) {
	return (
		<section className={classNames('tracked-threads', {
			'tracked-threads--empty': trackedThreads.length === 0
		})}>
			{trackedThreads.length === 0 &&
				<div className="tracked-threads__empty">
					{getMessages(locale).trackedThreads.empty}
				</div>
			}
			{trackedThreads.length > 0 &&
				trackedThreads.map((thread) => (
					<TrackedThread
						key={`${thread.board.id}/${thread.id}`}
						thread={thread}
						locale={locale}
						selectedBoard={selectedBoard}
						selectedThread={selectedThread}
						selected={isThreadLocation &&
							selectedBoard.id === thread.board.id &&
							selectedThread.id === thread.id}
						dispatch={dispatch}/>
				))
			}
		</section>
	)
}

TrackedThreads.propTypes = {
	isThreadLocation: PropTypes.bool,
	locale: PropTypes.string.isRequired,
	trackedThreads: PropTypes.arrayOf(trackedThread).isRequired,
	selectedBoard: board.isRequired,
	selectedThread: thread.isRequired,
	dispatch: PropTypes.func.isRequired
}

// // Don't re-render `<TrackedThreads/>` on page navigation (on `route` change).
// TrackedThreads = React.memo(TrackedThreads)

function TrackedThread({
	selected,
	locale,
	thread,
	dispatch
}) {
	const onUntrackThread = useCallback(() => dispatch(untrackThread(thread)), [thread])
	const isLink = !thread.expired
	const Component = isLink ? Link : 'div'
	return (
		<div
			title={thread.title}
			className={classNames('tracked-threads__thread', {
				'tracked-threads__thread--expired': thread.expired,
				'tracked-threads__thread--selected': selected
			})}>
			<Component
				to={isLink ? getUrl(thread.board, thread) : undefined}
				className={classNames('tracked-threads__thread-inner', {
					'tracked-threads__thread__link': isLink
				})}>
				{thread.thumbnail &&
					<Picture
						border
						picture={thread.thumbnail}
						width={24}
						height={24}
						fit="cover"
						blur={thread.thumbnail.spoiler ? 0.1 : undefined}
						className="tracked-threads__thread__thumbnail"/>
				}
				<BoardUrl
					boardId={thread.board.id}
					className="tracked-threads__thread__board"/>
				<div className="tracked-threads__thread__title">
					{thread.title}
				</div>
				{thread.newRepliesCount &&
					<div className="tracked-threads__thread__new-replies">
						{thread.newRepliesCount}
					</div>
				}
				{thread.newCommentsCount &&
					<div className="tracked-threads__thread__new-comments">
						{thread.newCommentsCount}
					</div>
				}
			</Component>
			<ListButton
				muted
				icon="remove"
				onClick={onUntrackThread}
				title={getMessages(locale).trackedThreads.untrackThread}/>
		</div>
	)
}

TrackedThread.propTypes = {
	selected: PropTypes.bool,
	locale: PropTypes.string.isRequired,
	thread: threadTracker.isRequired,
	untrackThread: PropTypes.func.isRequired,
	dispatch: PropTypes.func.isRequired
}

TrackedThread = React.memo(TrackedThread)