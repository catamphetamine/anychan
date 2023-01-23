import React from 'react'
import PropTypes from 'prop-types'

import { thread as threadType } from '../../PropTypes.js'

import ChannelThreadWithComments from './ChannelThreadWithComments.js'
import ChannelThreadWithoutComments from './ChannelThreadWithoutComments.js'

const ChannelThread = ({
	item: thread,
	state,
	setState,
	onHeightChange,
	channelView,
	commonProps
}) => {
	const Component = channelView === 'new-comments'
		? ChannelThreadWithComments
		: ChannelThreadWithoutComments

	return (
		<Component
			thread={thread}
			state={state}
			setState={setState}
			onHeightChange={onHeightChange}
			commonProps={commonProps}
		/>
	)
}

ChannelThread.propTypes = {
	item: threadType.isRequired,

	state: PropTypes.object,

	// `setState()` property is provided by `virtual-scroller`.
	setState: PropTypes.func.isRequired,

	// `onHeightChange()` property is provided by `virtual-scroller`.
	onHeightChange: PropTypes.func.isRequired,

	channelView: PropTypes.string,

	commonProps: PropTypes.object.isRequired
}

// Using `React.memo()` so that `virtual-scroller`
// doesn't needlessly re-render items as the user scrolls.
export default React.memo(ChannelThread)