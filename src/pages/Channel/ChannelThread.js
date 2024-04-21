import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import { thread as threadType, commentTreeState } from '../../PropTypes.js'

import ChannelThreadWithComments from './ChannelThreadWithComments.js'
import ChannelThreadWithoutComments from './ChannelThreadWithoutComments.js'
import ChannelThreadTile from './ChannelThreadTile.js'

import useGetCommentById from '../Thread/useGetCommentById.js'

const ChannelThread = ({
	item: thread,
	state,
	setState,
	onHeightDidChange,
	channelLayout,
	commonProps
}) => {
	const getCommentById = useGetCommentById({
		thread
	})

	const commonPropsWithGetCommentById = useMemo(() => ({
		...commonProps,
		getCommentById
	}), [
		commonProps,
		getCommentById
	])

	const Component = channelLayout === 'threadsTiles'
		? ChannelThreadTile
		: (channelLayout === 'threadsListWithLatestComments'
			? ChannelThreadWithComments
			: ChannelThreadWithoutComments
		)

	return (
		<Component
			thread={thread}
			state={state}
			setState={setState}
			onHeightDidChange={onHeightDidChange}
			commonProps={commonPropsWithGetCommentById}
			getCommentById={getCommentById}
		/>
	)
}

ChannelThread.propTypes = {
	item: threadType.isRequired,

	state: commentTreeState,

	// `setState()` property is provided by `virtual-scroller`.
	setState: PropTypes.func.isRequired,

	// `onHeightDidChange()` property is provided by `virtual-scroller`.
	onHeightDidChange: PropTypes.func.isRequired,

	channelLayout: PropTypes.oneOf([
		'threadsList',
		'threadsListWithLatestComments',
		'threadsTiles'
	]),

	commonProps: PropTypes.object.isRequired
}

// Using `React.memo()` so that `virtual-scroller`
// doesn't needlessly re-render items as the user scrolls.
export default React.memo(ChannelThread)