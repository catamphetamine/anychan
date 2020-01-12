import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import getMessages from '../messages'

import StarIcon from './StarIcon'

import Menu from 'webapp-frontend/src/components/Menu'

import StarIconOutline from 'webapp-frontend/assets/images/icons/menu/star-outline.svg'
// import StarIconFill from 'webapp-frontend/assets/images/icons/menu/star-fill.svg'

import PictureIconOutline from 'webapp-frontend/assets/images/icons/picture-outline.svg'
import PictureIconFill from 'webapp-frontend/assets/images/icons/picture-fill.svg'

import SlideshowIconOutline from 'webapp-frontend/assets/images/icons/slideshow-outline.svg'
import SlideshowIconFill from 'webapp-frontend/assets/images/icons/slideshow-fill.svg'

import SearchIconOutline from 'webapp-frontend/assets/images/icons/menu/search-outline.svg'
import SearchIconFill from 'webapp-frontend/assets/images/icons/menu/search-fill.svg'

import { notify } from 'webapp-frontend/src/redux/notifications'

import './BoardThreadMenu.css'

export default function BoardThreadMenu({
	mode,
	locale,
	dispatch,
	isThreadTracked,
	setThreadTracked,
	isSearchBarShown,
	setSearchBarShown,
	areAttachmentsExpanded,
	setAttachmentsExpanded,
	openSlideshow,
	className,
	...rest
}) {
	const messages = getMessages(locale)

	const menuItems = mode === 'board' ?
	[
		{
			title: messages.actions.search,
			onClick: () => dispatch(notify(messages.notImplemented)),
			// onClick: () => setSearchBarShown(!isSearchBarShown),
			isSelected: isSearchBarShown,
			icon: SearchIconOutline,
			iconActive: SearchIconFill,
			size: 's'
		}
	]
	:
	[
		{
			title: isThreadTracked ? messages.trackedThreads.untrackThread : messages.trackedThreads.trackThread,
			onClick: () => setThreadTracked(!isThreadTracked),
			isSelected: isThreadTracked,
			pop: true,
			icon: StarIconOutline,
			iconActive: StarIcon
		},
		{
			title: areAttachmentsExpanded ? messages.post.collapseAttachments : messages.post.expandAttachments,
			onClick: () => setAttachmentsExpanded(!areAttachmentsExpanded),
			isSelected: areAttachmentsExpanded,
			icon: PictureIconOutline,
			iconActive: PictureIconFill
		},
		{
			title: messages.viewAttachments,
			onClick: openSlideshow,
			icon: SlideshowIconOutline,
			iconActive: SlideshowIconFill
		},
		{
			title: messages.actions.search,
			onClick: () => dispatch(notify(messages.notImplemented)),
			// onClick: () => setSearchBarShown(!isSearchBarShown),
			isSelected: isSearchBarShown,
			icon: SearchIconOutline,
			iconActive: SearchIconFill,
			size: 's'
		}
	]

	return (
		<Menu
			{...rest}
			className={classNames('BoardThreadMenu', className)}>
			{menuItems}
		</Menu>
	)
}

BoardThreadMenu.propTypes = {
	mode: PropTypes.oneOf(['board', 'thread']).isRequired,
	locale: PropTypes.string.isRequired,
	isThreadTracked: PropTypes.bool,
	setThreadTracked: PropTypes.func.isRequired,
	isSearchBarShown: PropTypes.bool,
	setSearchBarShown: PropTypes.func.isRequired,
	areAttachmentsExpanded: PropTypes.bool,
	setAttachmentsExpanded: PropTypes.func.isRequired,
	openSlideshow: PropTypes.func.isRequired,
	className: PropTypes.string
}