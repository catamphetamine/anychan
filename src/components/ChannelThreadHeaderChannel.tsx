import type { MouseEventHandler } from 'react'
import type { Channel } from '@/types'

import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-pages'

import ChannelUrl from './ChannelUrl.js'

import { channel } from '../PropTypes.js'

import getUrl from '../utility/getUrl.js'

import './ChannelThreadHeaderChannel.css'

export default function ChannelThreadHeaderChannel({
	channel,
	onClick,
	showTitle
}: ChannelThreadHeaderChannelProps) {
	// import ChannelPictureOrId from '../../components/ChannelPictureOrId.js'
	// <ChannelPictureOrId channel={channel}/>

	return (
		<Link
			to={getUrl(channel.id)}
			navigationContext={{ test: 'abc' }}
			className="ChannelThreadHeader-channelLink">
			<ChannelUrl
				channelId={channel.id}
				className="ChannelThreadHeader-channelId"
			/>
			{showTitle && channel.title ? channel.title : undefined}
		</Link>
	)
}

ChannelThreadHeaderChannel.propTypes = {
	channel: channel.isRequired,
	onClick: PropTypes.func,
	showTitle: PropTypes.bool
}

interface ChannelThreadHeaderChannelProps {
	channel: Channel,
	onClick?: MouseEventHandler<HTMLAnchorElement>,
	showTitle?: boolean
}