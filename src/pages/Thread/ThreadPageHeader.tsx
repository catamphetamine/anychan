import type { Channel, Thread, GetCommentById } from '@/types'

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

// import ThreadPageHeaderTitleSeparator from './ThreadPageHeaderTitleSeparator.js'
import useOnChannelLinkClick from '../../components/useOnChannelLinkClick.js'

import ThreadTitle from '../../components/ThreadTitle.js'
import ThreadPageHeaderToolbar from './ThreadPageHeaderToolbar.js'
import ThreadActivityIndicator from '../../components/ThreadActivityIndicator.js'
import ChannelThreadHeaderChannel from '../../components/ChannelThreadHeaderChannel.js'
import ChannelThreadHeaderSource from '../../components/ChannelThreadHeaderSource.js'

import useMessages from '../../hooks/useMessages.js'

import {
	thread as threadType,
	channel as channelType
} from '../../PropTypes.js'

// import LeftArrow from 'frontend-lib/icons/left-arrow-minimal-thin.svg'
import BoxIcon from 'frontend-lib/icons/box.svg'
import LockIcon from 'frontend-lib/icons/lock.svg'
import GhostIcon from 'frontend-lib/icons/ghost-neutral-cross-eyes-mouth-tongue.svg'

import SailingBoatIcon from '../../../assets/images/icons/sailing-boat.svg'
import SinkingBoatIcon from '../../../assets/images/icons/sailing-boat-sinking.svg'

import './ThreadPageHeader.css'

export default function ThreadPageHeader({
	channel,
	thread,
	openSlideshow,
	getCommentById,
	isThreadSubscribed,
	setThreadSubscribed,
	isSearchBarShown,
	setSearchBarShown,
	areAttachmentsExpanded,
	setAttachmentsExpanded
}: ThreadPageHeaderProps) {
	const messages = useMessages()

	const onChannelLinkClick = useOnChannelLinkClick({
		channelId: channel.id
	})

	// isSearchBarShown={isSearchBarShown}
	// setSearchBarShown={setSearchBarShown}
	const threadMenu = (
		<ThreadPageHeaderToolbar
			thread={thread}
			getCommentById={getCommentById}
			openSlideshow={openSlideshow}
			isThreadSubscribed={isThreadSubscribed}
			setThreadSubscribed={setThreadSubscribed}
			areAttachmentsExpanded={areAttachmentsExpanded}
			setAttachmentsExpanded={setAttachmentsExpanded}
		/>
	)

	const threadStatusIcon = (
		<>
			{thread.expired &&
				<ThreadStatusIcon
					title={messages.threadDeleted}
					Icon={GhostIcon}
				/>
			}
			{!thread.expired &&
				<>
					{thread.locked &&
						<>
							{thread.archived &&
								<ThreadStatusIcon
									title={messages.threadIsArchived}
									Icon={BoxIcon}
								/>
							}
							{!thread.archived &&
								<ThreadStatusIcon
									title={messages.threadIsLocked}
									Icon={LockIcon}
								/>
							}
						</>
					}
					{!thread.locked &&
						<>
							{/* When fetching a `thread` for a thread page, there're no properties
							    on the `thread` object that would tell what position does the thread have
							    in the channel catalog. Hence, there seems to be no way to tell
							    if a thread is reaching the bump limit or not, its position in the list, etc. */}
							{false && !thread.bumpLimitReached &&
								<ThreadStatusIcon
									title="Thread position in catalog: N of M"
									Icon={SailingBoatIcon}
								/>
							}
							{thread.bumpLimitReached &&
								<ThreadStatusIcon
									title={messages.threadBumpLimitReached}
									Icon={SinkingBoatIcon}
								/>
							}
							<ThreadActivityIndicator
								thread={thread}
								tooltipOffsetTop={4}
								tooltipAnchor="bottom"
								className="ThreadPageHeader-activityIndicator"
							/>
						</>
					}
				</>
			}
		</>
	)

	return (
		<header className="ThreadPageHeader">
			<div className="ThreadPageHeader-heading">
				<ChannelThreadHeaderSource/>
				<ChannelThreadHeaderChannel
					channel={channel}
					onClick={onChannelLinkClick}
				/>
				{/*<ThreadPageHeaderTitleSeparator className="ThreadPageHeader-titleSeparator"/>*/}
				<div className="ThreadPageHeader-titleAndStatusIcon">
					<ThreadTitleInHeader thread={thread} singleLine/>
					{threadStatusIcon}
				</div>
			</div>
			{threadMenu}
		</header>
	)
}

ThreadPageHeader.propTypes = {
	channel: channelType.isRequired,
	thread: threadType.isRequired,
	openSlideshow: PropTypes.func.isRequired,
	getCommentById: PropTypes.func.isRequired,
	isThreadSubscribed: PropTypes.bool,
	setThreadSubscribed: PropTypes.func.isRequired,
	isSearchBarShown: PropTypes.bool,
	setSearchBarShown: PropTypes.func.isRequired,
	areAttachmentsExpanded: PropTypes.bool,
	setAttachmentsExpanded: PropTypes.func.isRequired
}

interface ThreadPageHeaderProps {
	channel: Channel,
	thread: Thread,
	openSlideshow: () => void,
	getCommentById: GetCommentById,
	isThreadSubscribed?: boolean,
	setThreadSubscribed: (isThreadSubscribed: boolean) => void,
	isSearchBarShown?: boolean,
	setSearchBarShown: (isSearchBarShown: boolean) => void,
	areAttachmentsExpanded?: boolean,
	setAttachmentsExpanded: (areAttachmentsExpanded: boolean) => void
}

function ThreadTitleInHeader({
	thread,
	singleLine
}: ThreadTitleInHeaderProps) {
	// `title` attrubute is added because when a thread title is too long,
	// it's trimmed with an "...".
	return (
		<span
			title={singleLine ? thread.title : undefined}
			className={classNames('ThreadPageHeader-title', {
				'ThreadPageHeader-title--singleLine': singleLine
			})}>
			<ThreadTitle thread={thread}/>
		</span>
	)
}

ThreadTitleInHeader.propTypes = {
	thread: threadType.isRequired,
	singleLine: PropTypes.bool
}

interface ThreadTitleInHeaderProps {
	thread: Thread,
	singleLine?: boolean
}

function ThreadStatusIcon({
	Icon,
	title
}: ThreadStatusIconProps) {
	// `title` doesn't work well on `<svg/>`s:
	// it only works when hovering the exact lines / paths
	// of an `<svg/>` rather than anywhere inside its rectangular space.
	return (
		<div
			title={title}
			className="ThreadPageHeader-statusIcon">
			<Icon title={title}/>
		</div>
	)
}

ThreadStatusIcon.propTypes = {
	Icon: PropTypes.elementType.isRequired,
	title: PropTypes.string.isRequired
}

interface ThreadStatusIconProps {
	Icon: React.ElementType,
	title: string
}