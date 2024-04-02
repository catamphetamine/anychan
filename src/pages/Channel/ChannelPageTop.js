import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import ChannelCreateThreadButton from './ChannelCreateThreadButton.js'
import ChannelPinnedThreads from './ChannelPinnedThreads.js'

import { channel as channelType, thread as threadType } from '../../PropTypes.js'

import './ChannelPageTop.css'

export default function ChannelPageTop({
	channel,
	pinnedThreads,
	threadComponentProps
}) {
	return (
		<div className={classNames('ChannelPageTop', {
			'ChannelPageTop--withPinnedThreads': pinnedThreads.length > 0
		})}>
			<ChannelCreateThreadButton
				channelId={channel.id}
				channelIsNotSafeForWork={channel.notSafeForWork}
			/>
			<ChannelPinnedThreads
				threads={pinnedThreads}
				threadComponentProps={threadComponentProps}
			/>
		</div>
	)
}

ChannelPageTop.propTypes = {
	channel: channelType.isRequired,
	pinnedThreads: PropTypes.arrayOf(threadType).isRequired,
	threadComponentProps: PropTypes.object.isRequired
}