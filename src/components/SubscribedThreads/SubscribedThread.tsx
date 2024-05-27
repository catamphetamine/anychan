import type { SubscribedThread as SubscribedThreadType, SubscribedThreadState } from '@/types'

import React, { useState, useRef, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
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

import useUserData from '../../hooks/useUserData.js'
import useMessages from '../../hooks/useMessages.js'

import getUrl from '../../utility/getUrl.js'
import doesSubscribedThreadHaveNewComments from '../../utility/subscribedThread/doesSubscribedThreadHaveNewComments.js'
import removeSubscribedThread from '@/utility/subscribedThread/removeSubscribedThread.js'
import restoreSubscribedThread from '@/utility/subscribedThread/restoreSubscribedThread.js'

import useEffectSkipMount from 'frontend-lib/hooks/useEffectSkipMount.js'

import './SubscribedThread.css'

function SubscribedThread({
	edit,
	selected,
	thread
}: SubscribedThreadProps) {
	const unsubscribeButton = useRef<HTMLButtonElement>()
	const undoUnsubscribeButton = useRef<HTMLButtonElement>()

	const userData = useUserData()
	const dispatch = useDispatch()
	const messages = useMessages()

	const [unsubscribed, setUnsubscribed] = useState(false)

	// If the user accidentally removes this thread from the list of
	// subscribed threads, and then clicks "Undo", the subscribed thread
	// record will be restored, along with its "stats" record.
	const subscribedThreadStateBeforeRemoval = useRef<SubscribedThreadState>()

	const onUnsubscribeToThread = useCallback(() => {
		// Get subscribed thread stats record in order to back it up in case the user
		// accidentally misclicked on the "Unsubscribe" button. In that case, an "Undo" button
		// could re-add the subscribed thread stats record.
		subscribedThreadStateBeforeRemoval.current = userData.getSubscribedThreadState(thread.channel.id, thread.id)
		removeSubscribedThread(thread, { userData, dispatch })
		setUnsubscribed(true)
	}, [thread, userData])

	const onRestoreSubscribedThread = useCallback(() => {
		restoreSubscribedThread({
			subscribedThread: thread,
			subscribedThreadState: subscribedThreadStateBeforeRemoval.current,
			dispatch,
			userData
		})
		setUnsubscribed(false)
	}, [thread, userData])

	useEffectSkipMount(() => {
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

	const hasNewComments = useMemo(() => {
		if (unsubscribed) {
			return false
		}
		return doesSubscribedThreadHaveNewComments(thread, { userData })
	}, [thread, userData])

	const hasNewReplies = useMemo(() => {
		if (unsubscribed) {
			return false
		}
		return doesSubscribedThreadHaveNewComments(thread, { type: 'reply', userData })
	}, [thread, userData])

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
						// @ts-expect-error
						title={messages.threadDeleted}
						style={THREAD_THUMBNAIL_WIDTH_STYLE}
						className="SubscribedThread-thumbnailPlaceholder"
					/>
				}
				{!thread.expired &&
					<ThreadThumbnail
						picture={thread.thumbnail}
						spoiler={thread.thumbnail.spoiler}
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
								// @ts-expect-error
								title={messages.threadIsArchived}
								className="SubscribedThread-icon"
							/>
						}
						{thread.locked && !thread.archived &&
							<LockIcon
								// @ts-expect-error
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
	thread: subscribedThread.isRequired
}

interface SubscribedThreadProps {
	edit?: boolean,
	selected?: boolean,
	thread: SubscribedThreadType
}

// `<SubscribedThreads/>` can be re-rendered on page navigation (on `route` change),
// because `<Sidebar/>` gets re-rendered. So `<SubscribedThread/>` is "memo"-ed
// in order to not to be re-rendered on page navigation because it accesses `localStorage`.
// Perhaps it doesn't make any difference, but it's just a conceptual thing.
const SubscribedThreadMemoized = React.memo(SubscribedThread)

export default SubscribedThreadMemoized

const THREAD_THUMBNAIL_WIDTH = 24

const THREAD_THUMBNAIL_WIDTH_STYLE = {
	width: THREAD_THUMBNAIL_WIDTH,
	height: THREAD_THUMBNAIL_WIDTH
}