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
}) {
	// import ChannelPictureOrId from '../../components/ChannelPictureOrId.js'
	// <ChannelPictureOrId channel={channel}/>

	return (
		<Link
			to={getUrl(channel.id)}
			onClick={onClick}
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