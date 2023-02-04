import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import ThreadThumbnail from '../ThreadThumbnail.js'
import CommentMoreActions from '../Comment/CommentMoreActions.js'
import CommentHidden from '../Comment/CommentHidden.js'
import useHide from '../Comment/useHide.js'

import isThreadPage from '../../utility/routes/isThreadPage.js'
import getBasePath from '../../utility/getBasePath.js'
import getUrl from '../../utility/getUrl.js'

import useRoute from '../../hooks/useRoute.js'

import Clickable from 'frontend-lib/components/Clickable.js'

import CommentClickableWrapper from '../Comment/CommentClickableWrapper.js'
import CommentThumbnail from '../Comment/CommentThumbnail.js'
import useSlideshow from '../Comment/useSlideshow.js'

import useOnThreadClick from '../useOnThreadClick.js'

import { thread } from '../../PropTypes.js'

// import getThreadThumbnail from '../../utility/thread/getThreadThumbnail.js'

import useLocale from '../../hooks/useLocale.js'
import useMessages from '../../hooks/useMessages.js'

import './SidebarThread.css'

export default function SidebarThread({
	item: thread,
	state,
	setState,
	onHeightChange
}) {
	const locale = useLocale()
	const messages = useMessages()

	const currentThread = useSelector(state => state.data.thread)

	const onThreadClick = useOnThreadClick()

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
		onHiddenChange: onHeightChange
	})

	useMemo(() => {
		thread.comments[0].createTextPreview()
	}, [thread])

	const threadThumbnailContainerStyle = useMemo(() => ({
		minWidth: SIDEBAR_THREAD_THUMBNAIL_WIDTH + 2 * SIDEBAR_THREAD_THUMBNAIL_BORDER_WIDTHH + 'px'
	}), [SIDEBAR_THREAD_THUMBNAIL_WIDTH, SIDEBAR_THREAD_THUMBNAIL_BORDER_WIDTHH])

	const threadThumbnailPlaceholderStyle = useMemo(() => ({
		width: SIDEBAR_THREAD_THUMBNAIL_WIDTH + 2 * SIDEBAR_THREAD_THUMBNAIL_BORDER_WIDTHH + 'px'
	}), [SIDEBAR_THREAD_THUMBNAIL_WIDTH, SIDEBAR_THREAD_THUMBNAIL_BORDER_WIDTHH])

	const { onAttachmentClick } = useSlideshow({
		comment: thread.comments[0]
	})

	const route = useRoute()

	const thumbnailElement = (
		<CommentThumbnail
			mode="channel"
			comment={thread.comments[0]}
			threadId={thread.id}
			maxWidth={SIDEBAR_THREAD_THUMBNAIL_WIDTH}
			onAttachmentClick={onAttachmentClick}
			locale={locale}
		/>
	)

	if (hidden) {
		return (
			<Clickable onClick={onUnHide}>
				<section data-thread-id={thread.id} className="SidebarThread SidebarThread--hidden">
					<div
						style={threadThumbnailPlaceholderStyle}
						className="SidebarThread-thumbnailPlaceholder"
					/>
					<CommentHidden
						mode="channel"
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
				className={classNames('SidebarThread', {
					'SidebarThread--current': isThreadPage(route) && currentThread && currentThread.id === thread.id
				})}>
				{/*thumbnail &&
					<ThreadThumbnail
						picture={thumbnail}
						width={SIDEBAR_THREAD_THUMBNAIL_WIDTH}
						className="SidebarThread-thumbnail"
					/>
				*/}

				{thumbnailElement &&
					<div style={threadThumbnailContainerStyle} className="SidebarThread-thumbnail">
						{thumbnailElement}
					</div>
				}

				{!thumbnailElement &&
					<div
						style={threadThumbnailPlaceholderStyle}
						className="SidebarThread-thumbnailPlaceholder"
					/>
				}

				<div className="SidebarThread-titleAndContent">
					{thread.titleCensored &&
						<h3 className="SidebarThread-title">
							{thread.titleCensored}
						</h3>
					}
					{thread.comments[0].textPreview &&
						<p className="SidebarThread-content">
							{thread.comments[0].textPreview}
						</p>
					}
					<CommentMoreActions
						comment={thread.comments[0]}
						threadId={thread.id}
						channelId={thread.channelId}
						messages={messages}
						onHide={onHide}
						url={getUrl(thread.channelId, thread.id)}
						urlBasePath={getBasePath()}
					/>
				</div>
			</section>
		</CommentClickableWrapper>
	)
}

SidebarThread.propTypes = {
	item: thread.isRequired
}

export const SIDEBAR_THREAD_THUMBNAIL_WIDTH = 128
const SIDEBAR_THREAD_THUMBNAIL_BORDER_WIDTHH = 1