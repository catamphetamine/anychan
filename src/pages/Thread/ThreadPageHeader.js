import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { Link } from 'react-pages'
import classNames from 'classnames'

import ThreadPageHeaderTitleSeparator from './ThreadPageHeaderTitleSeparator.js'
import useOnChannelLinkClick from '../../components/useOnChannelLinkClick.js'

import ThreadTitle from '../../components/ThreadTitle.js'
import Toolbar from '../../components/Toolbar.js'
import ThreadActivityIndicator from '../../components/ThreadActivityIndicator.js'
import ProviderLogo from '../../components/ProviderLogo.js'

import { getProvider } from '../../provider.js'
import getUrl from '../../utility/getUrl.js'

import useMessages from '../../hooks/useMessages.js'

import {
	thread as threadType,
	channel as channelType
} from '../../PropTypes.js'

import LeftArrow from 'frontend-lib/icons/left-arrow-minimal.svg'
import BoxIcon from 'frontend-lib/icons/box.svg'
import LockIcon from 'frontend-lib/icons/lock.svg'
import GhostIcon from 'frontend-lib/icons/ghost-neutral-cross-eyes-mouth-tongue.svg'

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
}) {
	const dispatch = useDispatch()
	const messages = useMessages()

	const onChannelLinkClick = useOnChannelLinkClick({
		channelId: channel.id
	})

	// isSearchBarShown={isSearchBarShown}
	// setSearchBarShown={setSearchBarShown}
	const threadMenu = (
		<Toolbar
			mode="thread"
			thread={thread}
			dispatch={dispatch}
			getCommentById={getCommentById}
			openSlideshow={openSlideshow}
			isThreadSubscribed={isThreadSubscribed}
			setThreadSubscribed={setThreadSubscribed}
			areAttachmentsExpanded={areAttachmentsExpanded}
			setAttachmentsExpanded={setAttachmentsExpanded}/>
	)

	const threadStatusIcon = (
		<>
			{thread.expired &&
				<ThreadStatusIcon
					title={messages.threadExpired}
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
						<ThreadActivityIndicator
							thread={thread}
							tooltipOffsetTop={4}
							tooltipAnchor="bottom"
							className="ThreadPageHeader-activityIndicator"
						/>
					}
				</>
			}
		</>
	)

	return (
		<header className="ThreadPageHeader">
			<div className="ThreadPageHeader-top">
				<div className="ThreadPageHeader-channelAndThreadTitle">
					<Link
						to="/"
						title={getProvider().title}
						className="ThreadPageHeader-logoLink">
						<ProviderLogo
							className="ThreadPageHeader-logo"/>
					</Link>
					<Link
						to={getUrl(channel.id)}
						onClick={onChannelLinkClick}
						className="ThreadPageHeader-backLink">
						{/*<LeftArrow className="ThreadPageHeader-backArrow"/>*/}
						<span className="ThreadPageHeader-backTitle">
							{channel.title}
						</span>
					</Link>
					<ThreadPageHeaderTitleSeparator className="ThreadPageHeader-titleSeparator"/>
					<ThreadTitleInHeader thread={thread} singleLine/>
					{threadStatusIcon}
				</div>
				{threadMenu}
			</div>
			<div className="ThreadPageHeader-titleOnNewLine">
				<ThreadTitleInHeader thread={thread}/>
				{threadStatusIcon}
			</div>
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

function ThreadTitleInHeader({ thread, singleLine }) {
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

function ThreadStatusIcon({ Icon, title }) {
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
};