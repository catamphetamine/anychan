import React from 'react'
import PropTypes from 'prop-types'

import getMessages from '../messages'

import Menu from 'webapp-frontend/src/components/Menu'

import StarIconOutline from 'webapp-frontend/assets/images/icons/menu/star-outline.svg'
import StarIconFill from 'webapp-frontend/assets/images/icons/menu/star-fill.svg'

import PictureIconOutline from 'webapp-frontend/assets/images/icons/picture.svg'
import PictureIconFill from 'webapp-frontend/assets/images/icons/picture-fill.svg'

import SlideshowIconOutline from 'webapp-frontend/assets/images/icons/slideshow-outline.svg'
import SlideshowIconFill from 'webapp-frontend/assets/images/icons/slideshow-fill.svg'

import SearchIconOutline from 'webapp-frontend/assets/images/icons/menu/search-outline.svg'
import SearchIconFill from 'webapp-frontend/assets/images/icons/menu/search-fill.svg'

import { notify } from 'webapp-frontend/src/redux/notifications'

import './BoardOrThreadMenu.css'

export default function BoardOrThreadMenu({
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
	...rest
}) {
	const messages = getMessages(locale)

	const menuItems = mode === 'board' ?
	[
		{
			title: messages.actions.search,
			onClick: () => dispatch(notify('Not implemented yet')),
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
			icon: StarIconOutline,
			iconActive: StarIconFill
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
			onClick: () => dispatch(notify('Not implemented yet')),
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
			className="board-or-thread-menu">
			{menuItems}
		</Menu>
	)
}

BoardOrThreadMenu.propTypes = {
	mode: PropTypes.oneOf(['board', 'thread']).isRequired,
	locale: PropTypes.string.isRequired,
	isThreadTracked: PropTypes.bool,
	setThreadTracked: PropTypes.func.isRequired,
	isSearchBarShown: PropTypes.bool,
	setSearchBarShown: PropTypes.func.isRequired,
	areAttachmentsExpanded: PropTypes.bool,
	setAttachmentsExpanded: PropTypes.func.isRequired,
	openSlideshow: PropTypes.func.isRequired
}