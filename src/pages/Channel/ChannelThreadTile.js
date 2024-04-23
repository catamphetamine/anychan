import React, { useCallback } from 'react'
import PropTypes from 'prop-types'

import { thread as threadType, commentTreeState } from '../../PropTypes.js'

import CommentBlock from '../../components/Comment/CommentBlock.js'

export default function ChannelThreadTile({
	thread,
	state,
	setState,
	onHeightDidChange,
	commonProps
}) {
	const setHidden = useCallback((hidden) => {
		setState({
			...state,
			hidden
		})
	}, [
		state,
		setState
	])

	const getThread = useCallback(() => thread, [thread])

	// threadIsTrimming={thread.trimming}
	// threadIsArchived={thread.archived}

	// Properties `initialExpandContent` and `onExpandContentChange` are set here explicitly
	// because this component, unlike the corresponding component on a thread's page,
	// isn't rendered by `<CommentTree/>` which adds those properties automatically.
	return (
		<CommentBlock
			{...commonProps}
			comment={thread.comments[0]}
			getThread={getThread}
			threadId={thread.id}
			onRenderedContentDidChange={onHeightDidChange}
			initialHidden={state && state.hidden}
			setHidden={setHidden}
		/>
	)
}

ChannelThreadTile.propTypes = {
	thread: threadType.isRequired,

	state: commentTreeState,

	// `setState()` property is provided by `virtual-scroller`.
	setState: PropTypes.func.isRequired,

	// `onHeightDidChange()` property is provided by `virtual-scroller`.
	onHeightDidChange: PropTypes.func.isRequired,

	commonProps: PropTypes.object
}