import type { Thread, Props } from '@/types'

import React from 'react'
import PropTypes from 'prop-types'

import ChannelThread from './ChannelThread.js'

import { thread as threadType } from '../../PropTypes.js'

import './ChannelPinnedThread.css'

export interface ExpandedPinnedThreadState {
	mode: 'channel',
	// Ignore the "Hidden" status of the thread when expanding it from a preview.
	// The rationale is that if a user is expanding a thread from a preview,
	// they intend to view the thread rather than a "Hidden thread" placeholder.
	ignoreHiddenState: true,
	hidden?: boolean,
	transformInitialItemState: (itemState: object) => object
}

export default function ChannelPinnedThread({
	thread,
	threadComponentProps,
	state,
	setState
}: ChannelPinnedThreadProps) {
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

interface ChannelPinnedThreadProps {
	thread: Thread,
	threadComponentProps?: Omit<Props<typeof ChannelThread>, 'state' | 'setState' | 'item' | 'onHeightDidChange'>,
	state: Props<typeof ChannelThread>['state'],
	setState: Props<typeof ChannelThread>['setState']
}

function onHeightDidChange() {
	// Doesn't matter because it's not a `virtual-scroller` list.
}