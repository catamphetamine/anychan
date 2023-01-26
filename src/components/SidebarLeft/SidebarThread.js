import React, { useMemo } from 'react'

import ThreadThumbnail from '../ThreadThumbnail.js'
import CommentMoreActions from '../Comment/CommentMoreActions.js'
import CommentHidden from '../Comment/CommentHidden.js'
import useHide from '../Comment/useHide.js'

import getBasePath from '../../utility/getBasePath.js'
import getUrl from '../../utility/getUrl.js'

import Clickable from 'frontend-lib/components/Clickable.js'

import CommentClickableWrapper from '../Comment/CommentClickableWrapper.js'
import CommentThumbnail from '../Comment/CommentThumbnail.js'
import useSlideshow from '../Comment/useSlideshow.js'

import useOnCommentClick from '../../pages/Channel/useOnCommentClick.js'

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

	const onCommentClick = useOnCommentClick()

	// const thumbnail = useMemo(() => {
	// 	return getThreadThumbnail(thread)
	// }, [thread])

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
		minWidth: THREAD_THUMBNAIL_WIDTH + 2 * THREAD_THUMBNAIL_BORDER_WIDTH + 'px'
	}), [THREAD_THUMBNAIL_WIDTH, THREAD_THUMBNAIL_BORDER_WIDTH])

	const threadThumbnailPlaceholderStyle = useMemo(() => ({
		width: THREAD_THUMBNAIL_WIDTH + 2 * THREAD_THUMBNAIL_BORDER_WIDTH + 'px'
	}), [THREAD_THUMBNAIL_WIDTH, THREAD_THUMBNAIL_BORDER_WIDTH])

	const { onAttachmentClick } = useSlideshow({
		comment: thread.comments[0]
	})

	const thumbnailElement = (
		<CommentThumbnail
			mode="channel"
			comment={thread.comments[0]}
			threadId={thread.id}
			maxWidth={THREAD_THUMBNAIL_WIDTH}
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
			onClick={onCommentClick}
		>
			<section data-thread-id={thread.id} className="SidebarThread">
				{/*thumbnail &&
					<ThreadThumbnail
						picture={thumbnail}
						width={THREAD_THUMBNAIL_WIDTH}
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

				<div className="SidebarThread-text">
					<h3 className="SidebarThread-title">
						{thread.titleCensored}
					</h3>
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

const THREAD_THUMBNAIL_WIDTH = 128
const THREAD_THUMBNAIL_BORDER_WIDTH = 1