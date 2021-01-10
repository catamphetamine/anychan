import React, { useCallback } from 'react'
import PropTypes from 'prop-types'

import { channelId } from '../../PropTypes'

import Comment from '../../components/Comment/CommentWrapped'

import getUrl from '../../utility/getUrl'

export default function ChannelThread({
	state,
	channelId,
	onStateChange,
	onHeightChange,
	children: thread,
	...rest
}) {
	const onExpandContent = useCallback(() => {
		onStateChange({
			expandContent: true
		})
	}, [onStateChange])
	const comment = thread.comments[0]
	// Passing `initialExpandContent` and `onExpandContent` explicitly
	// because it doesn't use `<CommentTree/>` that passes
	// those properties automatically.
	return (
		<Comment
			key={comment.id}
			comment={comment}
			channelId={channelId}
			threadId={thread.id}
			threadIsRolling={thread.isRolling}
			onClickUrl={getUrl(channelId, thread.id)}
			initialExpandContent={state && state.expandContent}
			onExpandContent={onExpandContent}
			onStateChange={onStateChange}
			onRenderedContentDidChange={onHeightChange}
			{...rest}/>
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