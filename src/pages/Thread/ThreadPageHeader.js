import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { Link } from 'react-pages'

import ThreadPageHeaderTitleSeparator from './ThreadPageHeaderTitleSeparator'

import BoardThreadMenu from '../../components/BoardThreadMenu'
import ThreadActivityIndicator from '../../components/ThreadActivityIndicator'

import getUrl from '../../utility/getUrl'

import {
	thread as threadType,
	board as boardType
} from '../../PropTypes'

import LeftArrow from 'webapp-frontend/assets/images/icons/left-arrow-minimal.svg'

import './ThreadPageHeader.css'

export default function ThreadPageHeader({
	board,
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
	const threadMenu = (
		<BoardThreadMenu
			mode="thread"
			dispatch={dispatch}
			locale={locale}
			openSlideshow={openSlideshow}
			isThreadTracked={isThreadTracked}
			setThreadTracked={setThreadTracked}
			isSearchBarShown={isSearchBarShown}
			setSearchBarShown={setSearchBarShown}
			areAttachmentsExpanded={areAttachmentsExpanded}
			setAttachmentsExpanded={setAttachmentsExpanded}/>
	)
	const titleElement = (
		<span className="ThreadPageHeader-title">
			{thread.titleCensored || thread.title}
		</span>
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
				<div className="ThreadPageHeader-boardAndThreadTitle">
					<Link
						to={getUrl(board)}
						onClick={onBack}
						className="ThreadPageHeader-backLink">
						<LeftArrow className="ThreadPageHeader-backArrow"/>
						<span className="ThreadPageHeader-backTitle">
							{board.title}
						</span>
					</Link>
					<ThreadPageHeaderTitleSeparator className="ThreadPageHeader-titleSeparator"/>
					{titleElement}
					{threadActivityIndicatorElement}
				</div>
				{threadMenu}
			</div>
			<div className="ThreadPageHeader-titleOnNewLine">
				{titleElement}
				{threadActivityIndicatorElement}
			</div>
		</header>
	)
}

ThreadPageHeader.propTypes = {
	board: boardType.isRequired,
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