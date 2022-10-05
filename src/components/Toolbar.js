import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import useMessages from '../hooks/useMessages.js'

import { thread as threadType } from '../PropTypes.js'
import serializeThread from '../utility/thread/serializeThread.js'

import StarIcon from './StarIcon.js'

import Menu from 'frontend-lib/components/Menu.js'

import StarIconOutline from 'frontend-lib/icons/fill-and-outline/star-outline.svg'
// import StarIconFill from 'frontend-lib/icons/fill-and-outline/star-fill.svg'

import PictureIconOutline from 'frontend-lib/icons/picture-outline.svg'
import PictureIconFill from 'frontend-lib/icons/picture-fill.svg'

import SlideshowIconOutline from 'frontend-lib/icons/slideshow-outline.svg'
import SlideshowIconFill from 'frontend-lib/icons/slideshow-fill.svg'

import SearchIconOutline from 'frontend-lib/icons/fill-and-outline/search-outline.svg'
import SearchIconFill from 'frontend-lib/icons/fill-and-outline/search-fill.svg'

// import DownloadIconOutline from 'frontend-lib/icons/download-cloud.svg'

import ThreadsIconOutline from '../../assets/images/icons/toolbar/threads-icon-outline.svg'

// `class="st0"` is used there to work around `svgr` bug.
// https://github.com/gregberge/svgr/issues/771
// Or maybe "play" with "SVGO" config options.
// https://react-svgr.com/docs/options/
import ThreadWithCommentsIconOutline from '../../assets/images/icons/toolbar/thread-with-comments-icon-outline.svg'

import PopularThreadsIconOutline from '../../assets/images/icons/toolbar/popular-threads-icon-outline.svg'

// import ThreadIconOutline from '../../assets/images/icons/toolbar/thread-icon-outline.svg'
// import CommentIconOutline from '../../assets/images/icons/toolbar/comment-icon-outline.svg'

import FireIconOutline from '../../assets/images/icons/fire-outline.svg'
import FireIconFill from '../../assets/images/icons/fire.svg'

import { notify } from '../redux/notifications.js'
import saveFile from 'frontend-lib/utility/saveFile.js'

import './Toolbar.css'

export default function Toolbar({
	mode,
	thread,
	dispatch,
	isThreadSubscribed,
	setThreadSubscribed,
	isSearchBarShown,
	setSearchBarShown,
	areAttachmentsExpanded,
	setAttachmentsExpanded,
	channelView,
	setChannelView,
	openSlideshow,
	getCommentById,
	className,
	...rest
}) {
	const messages = useMessages()

	// const onDownloadThread = useDownloadThread({
	// 	thread,
	// 	getCommentById
	// })

	const menuItems = mode === 'channel' ?
	[
		{
			title: messages.channelViewMode.newThreads,
			onClick: () => setChannelView('new-threads'),
			isSelected: channelView === 'new-threads',
			icon: ThreadsIconOutline,
			className: 'Toolbar-item--channelView'
			// className: classNames('Toolbar-item--channelView', 'Toolbar-item--channelViewNewThreads')
		},
		{
			title: messages.channelViewMode.newComments,
			onClick: () => setChannelView('new-comments'),
			isSelected: channelView === 'new-comments',
			icon: ThreadWithCommentsIconOutline,
			className: 'Toolbar-item--channelView'
		},
		{
			title: messages.channelViewMode.popular,
			onClick: () => setChannelView('popular'),
			isSelected: channelView === 'popular',
			icon: PopularThreadsIconOutline,
			// icon: FireIconOutline,
			// iconActive: FireIconFill,
			className: 'Toolbar-item--channelView'
			// className: classNames('Toolbar-item--channelView', 'Toolbar-item--channelViewRightmost')
		},
		{
			type: 'separator'
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
	:
	[
		{
			title: isThreadSubscribed ? messages.subscribedThreads.unsubscribeFromThread : messages.subscribedThreads.subscribeToThread,
			onClick: () => setThreadSubscribed(!isThreadSubscribed),
			isSelected: isThreadSubscribed,
			animate: 'pop',
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
			title: messages.post.viewAttachments,
			onClick: openSlideshow,
			icon: SlideshowIconOutline,
			iconActive: SlideshowIconFill
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
		// 	onClick: () => dispatch(notify(messages.notImplemented)),
		// 	// onClick: () => setSearchBarShown(!isSearchBarShown),
		// 	isSelected: isSearchBarShown,
		// 	icon: SearchIconOutline,
		// 	iconActive: SearchIconFill,
		// 	size: 's'
		// }
	]

	return (
		<Menu
			{...rest}
			className={classNames('Toolbar', className)}>
			{menuItems}
		</Menu>
	)
}

Toolbar.propTypes = {
	mode: PropTypes.oneOf(['channel', 'thread']).isRequired,
	thread: threadType,
	dispatch: PropTypes.func.isRequired,
	isThreadSubscribed: PropTypes.bool,
	setThreadSubscribed: PropTypes.func,
	isSearchBarShown: PropTypes.bool,
	setSearchBarShown: PropTypes.func,
	areAttachmentsExpanded: PropTypes.bool,
	setAttachmentsExpanded: PropTypes.func,
	channelView: PropTypes.oneOf(['new-threads', 'new-comments']),
	setChannelView: PropTypes.func,
	openSlideshow: PropTypes.func,
	getCommentById: PropTypes.func,
	className: PropTypes.string
}