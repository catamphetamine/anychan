import React from 'react'
import PropTypes from 'prop-types'

import ChannelThread from './ChannelThread.js'

import { thread as threadType } from '../../PropTypes.js'

import './ChannelPinnedThread.css'

export default function ChannelPinnedThread({
	thread,
	threadComponentProps,
	state,
	setState
}) {
	return (
		<ChannelThread
			{...threadComponentProps}
			item={thread}
			state={state}
			setState={setState}
			onHeightDidChange={onHeightDidChange}
		/>
	)
}

ChannelPinnedThread.propTypes = {
	thread: threadType.isRequired,
	threadComponentProps: PropTypes.object.isRequired,
	state: PropTypes.object,
	setState: PropTypes.func.isRequired
}

function onHeightDidChange() {
	// Doesn't matter because it's not a `virtual-scroller` list.
}