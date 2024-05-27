import type { Thread } from '@/types'

import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import CommentMoreActions from '../Comment/CommentMoreActions.js'
import CommentHidden from '../Comment/CommentHidden.js'
import useHide from '../Comment/useHide.js'
import useReport from '../Comment/useReport.js'

import isThreadPage from '../../utility/routes/isThreadPage.js'
import getUrl from '../../utility/getUrl.js'

import useRoute from '../../hooks/useRoute.js'
import useUrlBasePath from '../../hooks/useUrlBasePath.js'

import Clickable from 'frontend-lib/components/Clickable.js'

import CommentClickableWrapper from '../Comment/CommentClickableWrapper.js'
import CommentThumbnail from '../Comment/CommentThumbnail.js'
import useSlideshow from '../Comment/useSlideshow.js'

import useOnThreadClick from '../useOnThreadClick.js'

import { thread, commentTreeState } from '../../PropTypes.js'

// import getThreadThumbnail from '../../utility/thread/getThreadThumbnail.js'

import useMessages from '../../hooks/useMessages.js'
import usePageStateSelectorOutsideOfPage from '../../hooks/usePageStateSelectorOutsideOfPage.js'

import './ChannelThreadsSidebarSectionThread.css'

export interface SidebarThreadState {
	hidden?: boolean;
}

const ChannelThreadsSidebarSectionThread = ({
	item: thread,
	state,
	setState,
	onHeightDidChange
}: {
	item: Thread,
	state?: SidebarThreadState,
	setState: (state: SidebarThreadState) => void,
	onHeightDidChange: () => void
}) => {
	const messages = useMessages()

	const urlBasePath = useUrlBasePath()

	const currentThread = usePageStateSelectorOutsideOfPage('thread', state => state.thread.thread)

	const onThreadClick = useOnThreadClick()

	const {
		onReport
	} = useReport({
		channelId: thread.channelId,
		threadId: thread.id,
		commentId: thread.id
	})

	const {
		hidden,
		onHide,
		onUnHide
	} = useHide({
		channelId: thread.channelId,
		threadId: thread.id,
		comment: thread.comments[0],
		initialHidden: state && state.hidden,
		setHidden: (hidden) => setState({
			...state,
			hidden
		}),
		onAfterHiddenChange: () => {
			if (onHeightDidChange) {
				onHeightDidChange()
			}
		}
	})

	const threadThumbnailContainerStyle = useMemo(() => ({
		minWidth: CHANNEL_THREADS_SIDEBAR_SECTION_THREAD_THUMBNAIL_WIDTH + 2 * SIDEBAR_THREAD_THUMBNAIL_BORDER_WIDTHH + 'px'
	}), [CHANNEL_THREADS_SIDEBAR_SECTION_THREAD_THUMBNAIL_WIDTH, SIDEBAR_THREAD_THUMBNAIL_BORDER_WIDTHH])

	const threadThumbnailPlaceholderStyle = useMemo(() => ({
		width: CHANNEL_THREADS_SIDEBAR_SECTION_THREAD_THUMBNAIL_WIDTH + 2 * SIDEBAR_THREAD_THUMBNAIL_BORDER_WIDTHH + 'px'
	}), [CHANNEL_THREADS_SIDEBAR_SECTION_THREAD_THUMBNAIL_WIDTH, SIDEBAR_THREAD_THUMBNAIL_BORDER_WIDTHH])

	const { onAttachmentClick } = useSlideshow({
		comment: thread.comments[0]
	})

	const route = useRoute()

	const thumbnailElement = (
		<CommentThumbnail
			mode="channel"
			comment={thread.comments[0]}
			threadId={thread.id}
			fit="cover"
			width={CHANNEL_THREADS_SIDEBAR_SECTION_THREAD_THUMBNAIL_WIDTH}
			height={CHANNEL_THREADS_SIDEBAR_SECTION_THREAD_THUMBNAIL_WIDTH}
			onAttachmentClick={onAttachmentClick}
			messages={messages}
		/>
	)

	if (hidden) {
		return (
			<Clickable onClick={onUnHide}>
				<section data-thread-id={thread.id} className="ChannelThreadsSidebarSectionThread ChannelThreadsSidebarSectionThread--hidden">
					<div
						style={threadThumbnailPlaceholderStyle}
						className="ChannelThreadsSidebarSectionThread-thumbnailPlaceholder"
					/>
					<CommentHidden
						type="thread"
						comment={thread.comments[0]}
						messages={messages}
					/>
				</section>
			</Clickable>
		)
	}

	return (
		<CommentClickableWrapper
			channelId={thread.channelId}
			threadId={thread.id}
			commentId={thread.comments[0].id}
			onClick={onThreadClick}
		>
			<section
				data-thread-id={thread.id}
				className={classNames('ChannelThreadsSidebarSectionThread', {
					'ChannelThreadsSidebarSectionThread--current': isThreadPage(route) && currentThread && currentThread.id === thread.id
				})}>
				{/*thumbnail &&
					<ThreadThumbnail
						picture={thumbnail}
						width={CHANNEL_THREADS_SIDEBAR_SECTION_THREAD_THUMBNAIL_WIDTH}
						className="ChannelThreadsSidebarSectionThread-thumbnail"
					/>
				*/}

				{thumbnailElement &&
					<div style={threadThumbnailContainerStyle} className="ChannelThreadsSidebarSectionThread-thumbnail">
						{thumbnailElement}
					</div>
				}

				{!thumbnailElement &&
					<div
						style={threadThumbnailPlaceholderStyle}
						className="ChannelThreadsSidebarSectionThread-thumbnailPlaceholder"
					/>
				}

				<div className="ChannelThreadsSidebarSectionThread-titleAndContent">
					{thread.titleCensored &&
						<h3 className="ChannelThreadsSidebarSectionThread-title">
							{thread.titleCensored}
						</h3>
					}
					{thread.comments[0].textPreviewForSidebar &&
						<p className="ChannelThreadsSidebarSectionThread-content">
							{thread.comments[0].textPreviewForSidebar}
						</p>
					}
					<CommentMoreActions
						comment={thread.comments[0]}
						threadId={thread.id}
						channelId={thread.channelId}
						messages={messages}
						onHide={onHide}
						onReport={onReport}
						url={getUrl(thread.channelId, thread.id)}
						urlBasePath={urlBasePath}
					/>
				</div>
			</section>
		</CommentClickableWrapper>
	)
}

ChannelThreadsSidebarSectionThread.propTypes = {
	item: thread.isRequired,
	state: commentTreeState,
	setState: PropTypes.func.isRequired,
	onHeightDidChange: PropTypes.func
}

// Using `React.memo()` so that `virtual-scroller`
// doesn't re-render items as the user scrolls.
//
// Also prevents unneeded re-rendering of the list's items
// when the user enters or exits fullscreen for a `<video/>` element.
// In those cases, `.simplebar-content-wrapper` element's `height` changes
// which triggers an `onResize()` listener of `virtual-scroller`,
// which determines that the scrollable container's height did change
// so it re-renders the list with the updated "shown item indexes".
//
export default React.memo(ChannelThreadsSidebarSectionThread)

export const CHANNEL_THREADS_SIDEBAR_SECTION_THREAD_THUMBNAIL_WIDTH = 128
const SIDEBAR_THREAD_THUMBNAIL_BORDER_WIDTHH = 1