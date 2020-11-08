import React, { useMemo, useState, useRef, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-responsive-ui'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-pages'
import classNames from 'classnames'

import ListButton from '../ListButton'
import BoardUrl from '../BoardUrl'

import Picture from 'webapp-frontend/src/components/Picture'

import getMessages from '../../messages'
import getUrl from '../../utility/getUrl'

import { untrackThread, trackThread } from '../../redux/threadTracker'

import './TrackedThread.css'

function TrackedThread({
	edit,
	selected,
	locale,
	thread
}) {
	const addedAt = useMemo(() => thread.addedAt, [thread])
	const untrackButton = useRef()
	const undoUntrackButton = useRef()
	const dispatch = useDispatch()
	const [untracked, setUntracked] = useState()
	const onUntrackThread = useCallback(() => {
		dispatch(untrackThread(thread))
		setUntracked(true)
	}, [thread])
	const onTrackThread = useCallback(() => {
		dispatch(trackThread(thread, { addedAt }))
		setUntracked(false)
	}, [thread, addedAt])
	useEffect(() => {
		if (untracked) {
			// Expired threads don't get an "Undo" button.
			if (undoUntrackButton.current) {
				undoUntrackButton.current.focus()
			}
		} else if (untracked === false) {
			untrackButton.current.focus()
		}
	}, [untracked])
	const isDisabled = thread.expired || untracked
	const isLink = true // !isDisabled
	const Component = isLink ? Link : 'div'
	const isSelected = selected && !isDisabled
	return (
		<div
			title={thread.title}
			className={classNames('TrackedThread', {
				'TrackedThread--edit': edit,
				'TrackedThread--expired': thread.expired,
				'TrackedThread--untracked': untracked,
				'TrackedThread--selected': isSelected
			})}>
			<Component
				to={isLink ? getUrl(thread.board, thread) : undefined}
				className={classNames('TrackedThread-inner', {
					'TrackedThread-inner--link': isLink && !isDisabled
				})}>
				{thread.thumbnail &&
					<Picture
						border
						picture={thread.thumbnail}
						width={24}
						height={24}
						fit="cover"
						blur={thread.thumbnail.spoiler ? 0.1 : undefined}
						className="TrackedThread-thumbnail"/>
				}
				<BoardUrl
					boardId={thread.board.id}
					selected={isSelected}
					className="TrackedThread-board"/>
				<div className="TrackedThread-title">
					{thread.title}
				</div>
				{!thread.expired && thread.newRepliesCount &&
					<div className="TrackedThread-newReplies">
						{thread.newRepliesCount}
					</div>
				}
				{!thread.expired && thread.newCommentsCount &&
					<div className="TrackedThread-newComments">
						{thread.newCommentsCount}
					</div>
				}
			</Component>
			{(edit || thread.expired) && !untracked &&
				<ListButton
					ref={untrackButton}
					muted
					icon="remove"
					onClick={onUntrackThread}
					title={getMessages(locale).trackedThreads.untrackThread}/>
			}
			{edit && untracked && !thread.expired &&
				<Button
					ref={undoUntrackButton}
					title={getMessages(locale).trackedThreads.trackThread}
					onClick={onTrackThread}
					className="TrackedThread-undoUntrack rrui__button--text">
					{getMessages(locale).actions.undo}
				</Button>
			}
		</div>
	)
}

TrackedThread.propTypes = {
	edit: PropTypes.bool,
	selected: PropTypes.bool,
	locale: PropTypes.string.isRequired,
	thread: threadTracker.isRequired,
	untrackThread: PropTypes.func.isRequired
}

// `<TrackedThreads/>` can be re-rendered on page navigation (on `route` change),
// because `<Sidebar/>` gets re-rendered. So `<TrackedThread/>` is "memo"-ed
// in order to not to be re-rendered on page navigation because it accesses `localStorage`.
// Perhaps it doesn't make any difference, but it's just a conceptual thing.
TrackedThread = React.memo(TrackedThread)

export default TrackedThread