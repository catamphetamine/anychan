import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { Link } from 'react-pages'
import classNames from 'classnames'

import ThreadPageHeaderTitleSeparator from './ThreadPageHeaderTitleSeparator'

import ThreadTitle from '../../components/ThreadTitle'
import Toolbar from '../../components/Toolbar'
import ThreadActivityIndicator from '../../components/ThreadActivityIndicator'
import ProviderLogo from '../../components/ProviderLogo'

import { getProvider } from '../../provider'
import getUrl from '../../utility/getUrl'

import {
	thread as threadType,
	channel as channelType
} from '../../PropTypes'

import LeftArrow from 'webapp-frontend/assets/images/icons/left-arrow-minimal.svg'

import './ThreadPageHeader.css'

export default function ThreadPageHeader({
	channel,
	thread,
	onBack,
	locale,
	openSlideshow,
	isThreadTracked,
	setThreadTracked,
	isSearchBarShown,
	setSearchBarShown,
	areAttachmentsExpanded,
	setAttachmentsExpanded
}) {
	const dispatch = useDispatch()
	// isSearchBarShown={isSearchBarShown}
	// setSearchBarShown={setSearchBarShown}
	const threadMenu = (
		<Toolbar
			mode="thread"
			dispatch={dispatch}
			locale={locale}
			openSlideshow={openSlideshow}
			isThreadTracked={isThreadTracked}
			setThreadTracked={setThreadTracked}
			areAttachmentsExpanded={areAttachmentsExpanded}
			setAttachmentsExpanded={setAttachmentsExpanded}/>
	)
	const threadActivityIndicatorElement = (
		<ThreadActivityIndicator
			thread={thread}
			tooltipOffsetTop={4}
			tooltipAnchor="bottom"
			className="ThreadPageHeader-activityIndicator"/>
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
						onClick={onBack}
						className="ThreadPageHeader-backLink">
						{/*<LeftArrow className="ThreadPageHeader-backArrow"/>*/}
						<span className="ThreadPageHeader-backTitle">
							{channel.title}
						</span>
					</Link>
					<ThreadPageHeaderTitleSeparator className="ThreadPageHeader-titleSeparator"/>
					<ThreadTitleInHeader thread={thread} singleLine/>
					{threadActivityIndicatorElement}
				</div>
				{threadMenu}
			</div>
			<div className="ThreadPageHeader-titleOnNewLine">
				<ThreadTitleInHeader thread={thread}/>
				{threadActivityIndicatorElement}
			</div>
		</header>
	)
}

ThreadPageHeader.propTypes = {
	channel: channelType.isRequired,
	thread: threadType.isRequired,
	onBack: PropTypes.func.isRequired,
	locale: PropTypes.string.isRequired,
	openSlideshow: PropTypes.func.isRequired,
	isThreadTracked: PropTypes.bool,
	setThreadTracked: PropTypes.func.isRequired,
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