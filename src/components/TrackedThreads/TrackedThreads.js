import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-responsive-ui'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import useTrackedThreads from './useTrackedThreads'
import useViewMode from './useViewMode'
import TrackedThread from './TrackedThread'

import getMessages from '../../messages'
import { isThreadLocation } from '../../utility/routes'
import { trackedThread, board, thread } from '../../PropTypes'

import './TrackedThreads.css'

export default function TrackedThreads({ edit, maxListLength }) {
	const locale = useSelector(({ settings }) => settings.settings.locale)
	const selectedBoard = useSelector(({ chan }) => chan.board)
	const selectedThread = useSelector(({ chan }) => chan.thread)
	const isThreadPage = useSelector(({ found }) => isThreadLocation(found.resolvedMatch))
	const [
		trackedThreads,
		hasMoreThreads,
		hasMoreLiveThreads,
		hasExpiredThreads,
		getShownTrackedThreads
	] = useTrackedThreads({
		maxListLength,
		// Snapshot tracked threads list when entering edit mode,
		// so that they're not rearranged while the user is editing the list,
		// so that the user doesn't accidentally click the "delete" button
		// on a thread list item that wasn't intended to be clicked.
		snapshot: edit
	})
	const [
		viewMode,
		onShowMoreThreads,
		onShowLessThreads,
		showMoreLessButton,
		showExpiredThreadsButton
	] = useViewMode({
		hasMoreThreads,
		hasMoreLiveThreads
	})
	return (
		<section className={classNames('TrackedThreads', {
			'TrackedThreads--empty': trackedThreads.length === 0
		})}>
			{trackedThreads.length === 0 &&
				<div className="TrackedThreads-empty">
					{getMessages(locale).trackedThreads.empty}
				</div>
			}
			{trackedThreads.length > 0 &&
				getShownTrackedThreads(viewMode).map((thread) => (
					<TrackedThread
						key={`${thread.board.id}/${thread.id}`}
						edit={edit}
						thread={thread}
						locale={locale}
						selectedBoard={selectedBoard}
						selectedThread={selectedThread}
						selected={isThreadPage &&
							selectedBoard.id === thread.board.id &&
							selectedThread.id === thread.id}/>
				))
			}
			{hasMoreThreads && (hasMoreLiveThreads || viewMode === 'all') &&
				<div className="TrackedThreads-showMoreLessContainer">
					<Button
						ref={showMoreLessButton}
						onClick={viewMode === 'top' ? onShowMoreThreads : onShowLessThreads}
						className="TrackedThreads-showMoreLess rrui__button--text">
						{viewMode === 'top' ? getMessages(locale).actions.showMore : getMessages(locale).actions.showLess}
					</Button>
				</div>
			}
			{hasExpiredThreads && (viewMode === 'live' || (viewMode === 'top' && !hasMoreLiveThreads)) &&
				<div className="TrackedThreads-showMoreLessContainer">
					<Button
						ref={showExpiredThreadsButton}
						onClick={onShowMoreThreads}
						className="TrackedThreads-showExpired rrui__button--text">
						{getMessages(locale).trackedThreads.showExpired}
					</Button>
				</div>
			}
		</section>
	)
}

TrackedThreads.propTypes = {
	edit: PropTypes.bool,
	maxListLength: PropTypes.number.isRequired
	// isThreadLocation: PropTypes.bool,
	// locale: PropTypes.string.isRequired,
	// trackedThreads: PropTypes.arrayOf(trackedThread).isRequired,
	// selectedBoard: board.isRequired,
	// selectedThread: thread.isRequired
}

TrackedThreads.defaultProps = {
	maxListLength: 7
}

// // Don't re-render `<TrackedThreads/>` on page navigation (on `route` change).
// TrackedThreads = React.memo(TrackedThreads)