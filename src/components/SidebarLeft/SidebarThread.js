import React, { useMemo } from 'react'

import ThreadThumbnail from '../ThreadThumbnail.js'
import CommentMoreActions from '../Comment/CommentMoreActions.js'
import CommentHidden from '../Comment/CommentHidden.js'
import useHide from '../Comment/useHide.js'

import Clickable from 'frontend-lib/components/Clickable.js'

import { thread } from '../../PropTypes.js'

import getThreadThumbnail from '../../utility/thread/getThreadThumbnail.js'

import useMessages from '../../hooks/useMessages.js'

import './SidebarThread.css'

export default function SidebarThread({
	item: thread,
	state,
	setState,
	onHeightChange
}) {
	const messages = useMessages()

	const thumbnail = useMemo(() => {
		return getThreadThumbnail(thread)
	}, [thread])

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

	const threadThumbnailPlaceholderStyle = useMemo(() => ({
		width: THREAD_THUMBNAIL_WIDTH + 'px'
	}), [THREAD_THUMBNAIL_WIDTH])

	if (hidden) {
		return (
			<Clickable onClick={onUnHide}>
				<section className="SidebarThread SidebarThread--hidden">
					<div
						style={threadThumbnailPlaceholderStyle}
						className="SidebarThread-thumbnailPlaceholder"
					/>
					<CommentHidden
						mode="channel"
						comment={thread.comments[0]}
						messages={messages}
						onShow={onUnHide}
					/>
				</section>
			</Clickable>
		)
	}

	return (
		<section className="SidebarThread">
			<ThreadThumbnail
				picture={thumbnail}
				width={THREAD_THUMBNAIL_WIDTH}
				className="SidebarThread-thumbnail"
			/>

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
				/>
			</div>
		</section>
	)
}

SidebarThread.propTypes = {
	item: thread.isRequired
}

const THREAD_THUMBNAIL_WIDTH = 128