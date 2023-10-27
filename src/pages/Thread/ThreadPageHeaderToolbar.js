import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import useMessages from '../../hooks/useMessages.js'

import {
	thread as threadType,
	channel as channelType
} from '../../PropTypes.js'

import Toolbar from '../../components/Toolbar.js'

import StarIconOutline from 'frontend-lib/icons/fill-and-outline/star-outline.svg'
// import StarIconFill from 'frontend-lib/icons/fill-and-outline/star-fill.svg'

import PictureIconOutline from 'frontend-lib/icons/picture-outline.svg'
import PictureIconFill from 'frontend-lib/icons/picture-fill.svg'

import SlideshowIconOutline from 'frontend-lib/icons/slideshow-outline.svg'
import SlideshowIconFill from 'frontend-lib/icons/slideshow-fill.svg'

import StarIcon from '../../components/StarIcon.js'

export default function ThreadPageHeaderToolbar({
	thread,
	openSlideshow,
	getCommentById,
	isThreadSubscribed,
	setThreadSubscribed,
	areAttachmentsExpanded,
	setAttachmentsExpanded
}) {
	const dispatch = useDispatch()
	const messages = useMessages()

	const items = useMemo(() => [
		{
			title: isThreadSubscribed ? messages.subscribedThreads.unsubscribeFromThread : messages.subscribedThreads.subscribeToThread,
			onClick: () => setThreadSubscribed(!isThreadSubscribed),
			isSelected: isThreadSubscribed,
			animate: 'pop',
			icon: StarIconOutline,
			iconSelected: StarIcon
		},
		{
			title: areAttachmentsExpanded ? messages.post.collapseAttachments : messages.post.expandAttachments,
			onClick: () => setAttachmentsExpanded(!areAttachmentsExpanded),
			isSelected: areAttachmentsExpanded,
			icon: PictureIconOutline,
			iconSelected: PictureIconFill
		},
		{
			title: messages.post.viewAttachments,
			onClick: openSlideshow,
			icon: SlideshowIconOutline,
			iconSelected: SlideshowIconFill
		}
		// ,
		// {
		// 	title: messages.downloadThread,
		// 	onClick: onDownloadThread,
		// 	icon: DownloadIconOutline
		// }
		// ,
		// {
		// 	title: messages.actions.search,
		// 	onClick: () => ...,
		// 	// onClick: () => setSearchBarShown(!isSearchBarShown),
		// 	isSelected: isSearchBarShown,
		// 	icon: SearchIconOutline,
		// 	iconSelected: SearchIconFill,
		// 	size: 's'
		// }
	], [
		messages,
		isThreadSubscribed,
		setThreadSubscribed,
		areAttachmentsExpanded,
		setAttachmentsExpanded,
		openSlideshow
	])

	return (
		<Toolbar
			items={items}
			thread={thread}
			openSlideshow={openSlideshow}
			getCommentById={getCommentById}
			isThreadSubscribed={isThreadSubscribed}
			setThreadSubscribed={setThreadSubscribed}
			areAttachmentsExpanded={areAttachmentsExpanded}
			setAttachmentsExpanded={setAttachmentsExpanded}
		/>
	)
}

ThreadPageHeaderToolbar.propTypes = {
	thread: threadType.isRequired,
	openSlideshow: PropTypes.func.isRequired,
	getCommentById: PropTypes.func.isRequired,
	isThreadSubscribed: PropTypes.bool,
	setThreadSubscribed: PropTypes.func.isRequired,
	areAttachmentsExpanded: PropTypes.bool,
	setAttachmentsExpanded: PropTypes.func.isRequired
}