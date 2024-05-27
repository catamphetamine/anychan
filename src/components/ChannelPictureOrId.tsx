import type { Channel } from '@/types'

import React from 'react'
import PropTypes from 'prop-types'

import { channel } from '../PropTypes.js'

import ChannelUrl from './ChannelUrl.js'

import Picture from 'social-components-react/components/Picture.js'

export default function ChannelPictureOrId({
	channel,
	width
}: ChannelPictureOrIdProps) {
	// Didn't test.
	width = 16

	if (channel.picture) {
		return (
			<Picture
				border
				picture={channel.picture}
				width={width}
				height={width}
				fit="cover"
				className="ChannelPicture"
			/>
		)
	}
	return (
		<ChannelUrl channelId={channel.id}/>
	)
}

ChannelPictureOrId.propTypes = {
	channel: channel.isRequired,
	width: PropTypes.number
}

interface ChannelPictureOrIdProps {
	channel: Channel,
	width?: number
}