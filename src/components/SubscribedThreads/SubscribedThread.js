import React, { useState, useRef, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-pages'
import classNames from 'classnames'

import ListButton from '../ListButton.js'
import ChannelUrl from '../ChannelUrl.js'

import TextButton from '../TextButton.js'
import ThreadThumbnail from '../ThreadThumbnail.js'

import LockIcon from 'frontend-lib/icons/lock.svg'
import BoxIcon from 'frontend-lib/icons/box.svg'
import GhostIcon from 'frontend-lib/icons/ghost-neutral-cross-eyes-mouth-tongue.svg'

import { subscribedThread } from '../../PropTypes.js'

import getUrl from '../../utility/getUrl.js'
import doesSubscribedThreadHaveNewComments from '../../utility/subscribedThread/doesSubscribedThreadHaveNewComments.js'

import { unsubscribeFromThread, restoreSubscribedThread } from '../../redux/subscribedThreads.js'

import './SubscribedThread.css'

function SubscribedThread({
	edit,
	selected,
	messages,
	thread
}) {
	const unsubscribeButton = useRef()
	const undoUnsubscribeButton = useRef()

	const dispatch = useDispatch()
	const [unsubscribed, setUnsubscribed] = useState()

	// If the user accidentally removes this thread from the list of
	// subscribed threads, and then clicks "Undo", the subscribed thread
	// record will be restored, along with its "stats" record.
	const subscribedThreadStatsBeforeRemoval = useRef()

	const onUnsubscribeToThread = useCallback(async () => {
		const { subscribedThreadStats } = await dispatch(unsubscribeFromThread(thread))
		subscribedThreadStatsBeforeRemoval.current = subscribedThreadStats
		setUnsubscribed(true)
	}, [thread])

	const onRestoreSubscribedThread = useCallback(async () => {
		await dispatch(restoreSubscribedThread(thread, {
			subscribedThreadStats: subscribedThreadStatsBeforeRemoval.current
		}))
		setUnsubscribed(false)
	}, [thread])

	useEffect(() => {
		if (unsubscribed) {
			// Expired threads don't get an "Undo" button.
			if (undoUnsubscribeButton.current) {
				undoUnsubscribeButton.current.focus()
			}
		} else if (unsubscribed === false) {
			unsubscribeButton.current.focus()
		}
	}, [unsubscribed])

	const isDisabled = thread.expired || unsubscribed
	const isLink = true // !isDisabled
	const Component = isLink ? Link : 'div'
	const isSelected = selected && !isDisabled

	const hasNewComments = unsubscribed ? false : doesSubscribedThreadHaveNewComments(thread)
	const hasNewReplies = false

	return (
		<div
			title={thread.title}
			className={classNames('SubscribedThread', {
				'SubscribedThread--edit': edit,
				'SubscribedThread--expired': thread.expired,
				'SubscribedThread--archived': thread.archived,
				'SubscribedThread--locked': thread.locked,
				'SubscribedThread--unsubscribed': unsubscribed,
				'SubscribedThread--selected': isSelected
			})}>
			<Component
				to={isLink ? getUrl(thread.channel.id, thread.id) : undefined}
				className={classNames('SubscribedThread-inner', {
					'SubscribedThread-inner--link': isLink && !isDisabled
				})}>
				{thread.expired &&
					<GhostIcon
						title={messages.threadExpired}
						style={THREAD_THUMBNAIL_WIDTH_STYLE}
						className="SubscribedThread-thumbnailPlaceholder"
					/>
				}
				{!thread.expired &&
					<ThreadThumbnail
						picture={thread.thumbnail}
						width={THREAD_THUMBNAIL_WIDTH}
						className="SubscribedThread-thumbnail"
					/>
				}
				<ChannelUrl
					channelId={thread.channel.id}
					selected={isSelected}
					className="SubscribedThread-channel"
				/>
				<div className="SubscribedThread-title">
					{thread.title}
				</div>
				{!thread.expired &&
					<>
						{thread.archived &&
							<BoxIcon
								title={messages.threadIsArchived}
								className="SubscribedThread-icon"
							/>
						}
						{thread.locked && !thread.archived &&
							<LockIcon
								title={messages.threadIsLocked}
								className="SubscribedThread-icon"
							/>
						}
						{hasNewReplies &&
							<div className="SubscribedThread-newRepliesIcon">
								{messages.hasNewComments}
							</div>
						}
						{!hasNewReplies && hasNewComments &&
							<div className="SubscribedThread-newCommentsIcon">
								{messages.hasNewReplies}
							</div>
						}
					</>
				}
			</Component>
			{(edit || thread.expired) && !unsubscribed &&
				<ListButton
					ref={unsubscribeButton}
					muted
					icon="remove"
					onClick={onUnsubscribeToThread}
					title={messages.subscribedThreads.unsubscribeFromThread}
				/>
			}
			{edit && unsubscribed && !thread.expired &&
				<TextButton
					ref={undoUnsubscribeButton}
					title={messages.subscribedThreads.subscribeToThread}
					onClick={onRestoreSubscribedThread}
					className="SubscribedThread-undoUnsubscribe">
					{messages.actions.undo}
				</TextButton>
			}
		</div>
	)
}

SubscribedThread.propTypes = {
	edit: PropTypes.bool,
	selected: PropTypes.bool,
	messages: PropTypes.object.isRequired,
	thread: subscribedThread.isRequired
}

// `<SubscribedThreads/>` can be re-rendered on page navigation (on `route` change),
// because `<Sidebar/>` gets re-rendered. So `<SubscribedThread/>` is "memo"-ed
// in order to not to be re-rendered on page navigation because it accesses `localStorage`.
// Perhaps it doesn't make any difference, but it's just a conceptual thing.
SubscribedThread = React.memo(SubscribedThread)

export default SubscribedThread

const THREAD_THUMBNAIL_WIDTH = 24

const THREAD_THUMBNAIL_WIDTH_STYLE = {
	width: THREAD_THUMBNAIL_WIDTH,
	height: THREAD_THUMBNAIL_WIDTH
}