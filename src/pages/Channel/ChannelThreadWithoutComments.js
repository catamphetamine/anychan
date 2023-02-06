import React, { useCallback } from 'react'
import PropTypes from 'prop-types'

import { thread as threadType } from '../../PropTypes.js'

import CommentBlock from '../../components/Comment/CommentBlock.js'

export default function ChannelThreadWithoutComments({
	thread,
	state,
	setState,
	onHeightDidChange,
	commonProps
}) {
	const onExpandContentChange = useCallback((expandContent) => {
		setState({
			...state,
			expandContent
		})
	}, [
		state,
		setState
	])

	const setHidden = useCallback((hidden) => {
		setState({
			...state,
			hidden
		})
	}, [
		state,
		setState
	])

	// threadIsTrimming={thread.trimming}
	// threadIsArchived={thread.archived}

	// Properties `initialExpandContent` and `onExpandContentChange` are set here explicitly
	// because this component, unlike the corresponding component on a thread's page,
	// isn't rendered by `<CommentTree/>` which adds those properties automatically.
	return (
		<CommentBlock
			{...commonProps}
			comment={thread.comments[0]}
			threadId={thread.id}
			onRenderedContentDidChange={onHeightDidChange}
			initialExpandContent={state && state.expandContent}
			onExpandContentChange={onExpandContentChange}
			initialHidden={state && state.hidden}
			setHidden={setHidden}
		/>
	)
}

ChannelThreadWithoutComments.propTypes = {
	thread: threadType.isRequired,

	state: PropTypes.object,

	// `setState()` property is provided by `virtual-scroller`.
	setState: PropTypes.func.isRequired,

	// `onHeightDidChange()` property is provided by `virtual-scroller`.
	onHeightDidChange: PropTypes.func.isRequired,

	commonProps: PropTypes.object
}