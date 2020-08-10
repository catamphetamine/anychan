import React, { useRef, useState, useCallback, useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-responsive-ui'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-pages'
import classNames from 'classnames'

import ListButton from './ListButton'
import BoardUrl from './BoardUrl'

import getMessages from '../messages'
import getUrl from '../utility/getUrl'
import { isThreadLocation } from '../utility/routes'
import { untrackThread, trackThread } from '../redux/threadTracker'
import { trackedThread, board, thread } from '../PropTypes'

import Picture from 'webapp-frontend/src/components/Picture'

import './TrackedThreads.css'

export default function TrackedThreads({ edit, maxListLength }) {
	const hasMounted = useRef()
	const showMoreLessButton = useRef()
	const showExpiredThreadsButton = useRef()
	const isThreadPage = useSelector(({ found }) => isThreadLocation(found.resolvedMatch))
	const locale = useSelector(({ settings }) => settings.settings.locale)
	const selectedBoard = useSelector(({ chan }) => chan.board)
	const selectedThread = useSelector(({ chan }) => chan.thread)
	const _trackedThreads = useSelector(({ threadTracker }) => threadTracker.trackedThreads)
	const editTrackedThreadsList = useMemo(() => _trackedThreads, [edit])
	let trackedThreads = edit ? editTrackedThreadsList : _trackedThreads
	const hasMoreThreads = trackedThreads.length > maxListLength
	const liveThreads = trackedThreads.filter(_ => !_.expired)
	const hasMoreLiveThreads = liveThreads.length > maxListLength
	const allThreadsCount = trackedThreads.length
	const liveThreadsCount = liveThreads.length
	const hasExpiredThreads = allThreadsCount - liveThreadsCount > 0
	function getShowMode() {
		return hasMoreThreads ? (hasMoreLiveThreads ? 'top' : 'live') : 'all'
	}
	const [showMode, setShowMode] = useState(getShowMode())
	useEffect(() => {
		if (hasMounted.current) {
			setShowMode(getShowMode())
		}
	}, [allThreadsCount, liveThreadsCount])
	if (showMode !== 'all') {
		if (showMode === 'top') {
			trackedThreads = liveThreads.slice(0, maxListLength)
		} else if (showMode === 'live') {
			trackedThreads = liveThreads
		}
	}
	const onShowMoreThreads = useCallback(() => {
		if (showMode === 'top') {
			if (hasMoreLiveThreads) {
				setShowMode('live')
			} else {
				setShowMode('all')
			}
		} else {
			setShowMode('all')
		}
	}, [showMode, hasMoreLiveThreads])
	const onShowLessThreads = useCallback(() => {
		setShowMode('top')
	}, [])
	useEffect(() => {
		if (hasMounted.current) {
			// After a user clicks "Show expired",
			// move the focus to the "Show less" button.
			if (showMode === 'all') {
				if (hasMoreThreads) {
					showMoreLessButton.current.focus()
				}
			}
			// After a user clicks "Show less"
			// when there're no "more" live threads
			// but only "more" expired threads,
			// then move the focus to the "Show expired" button.
			else if (showMode === 'top') {
				if (!hasMoreLiveThreads) {
					showExpiredThreadsButton.current.focus()
				}
			}
		}
	}, [showMode])
	useEffect(() => {
		hasMounted.current = true
	}, [])
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
				trackedThreads.map((thread) => (
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
			{hasMoreThreads && (hasMoreLiveThreads || showMode === 'all') &&
				<div className="TrackedThreads-showMoreLessContainer">
					<Button
						ref={showMoreLessButton}
						onClick={showMode === 'top' ? onShowMoreThreads : onShowLessThreads}
						className="TrackedThreads-showMoreLess rrui__button--text">
						{showMode === 'top' ? getMessages(locale).actions.showMore : getMessages(locale).actions.showLess}
					</Button>
				</div>
			}
			{hasExpiredThreads && (showMode === 'live' || (showMode === 'top' && !hasMoreLiveThreads)) &&
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
	return (
		<div
			title={thread.title}
			className={classNames('TrackedThread', {
				'TrackedThread--edit': edit,
				'TrackedThread--expired': thread.expired,
				'TrackedThread--untracked': untracked,
				'TrackedThread--selected': selected && !isDisabled
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
					className="TrackedThreads-undo-untrack rrui__button--text">
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

TrackedThread = React.memo(TrackedThread)