import React, { useCallback } from 'react'
import PropTypes from 'prop-types'

import { channelId } from '../../PropTypes.js'

import Comment from '../../components/Comment/CommentAndStuff.js'

import getUrl from '../../utility/getUrl.js'

export default function ChannelThread({
	state,
	channelId,
	onStateChange,
	onHeightChange,
	children: thread,
	...rest
}) {
	const onExpandContentChange = useCallback((expandContent) => {
		onStateChange({
			expandContent
		})
	}, [onStateChange])

	const comment = thread.comments[0]

	// Passing `initialExpandContent` and `onExpandContentChange` explicitly
	// because it doesn't use `<CommentTree/>` which passes those properties automatically.
	return (
		<Comment
			key={comment.id}
			comment={comment}
			channelId={channelId}
			threadId={thread.id}
			threadIsTrimming={thread.trimming}
			threadIsArchived={thread.archived}
			onClickUrl={getUrl(channelId, thread.id)}
			initialExpandContent={state && state.expandContent}
			onExpandContentChange={onExpandContentChange}
			onStateChange={onStateChange}
			onRenderedContentDidChange={onHeightChange}
			{...rest}
		/>
	)
}

ChannelThread.propTypes = {
	channelId: channelId.isRequired,
	onStateChange: PropTypes.func.isRequired,
	onHeightChange: PropTypes.func.isRequired,
	children: PropTypes.object.isRequired
}

// Using `React.memo()` so that `virtual-scroller`
// doesn't re-render items as the user scrolls.
ChannelThread = React.memo(ChannelThread)