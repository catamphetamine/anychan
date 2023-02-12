import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-pages'
import { useSelector } from 'react-redux'
import VirtualScroller from 'virtual-scroller/react'

import Channels from '../components/Channels.js'
import ChannelUrl from '../components/ChannelUrl.js'

import { channel as channelType } from '../PropTypes.js'
import { getChannels } from '../redux/data.js'
import getUrl from '../utility/getUrl.js'

import getMessages from '../messages/index.js'

import './Channels.css'

export default function ChannelsPage() {
	const {
		channels,
		channelsByCategory,
		channelsByPopularity
	} = useSelector(state => state.data.allChannels)

	return (
		<section className="ChannelsPage Content Content--text">
			<Channels
				channels={channels}
				channelsByPopularity={channelsByPopularity}
				channelsByCategory={channelsByCategory}
				listComponent={ChannelsList}
				showAllChannels/>
		</section>
	)
}

ChannelsPage.meta = ({ settings }) => ({
	title: getMessages(settings.settings.locale).boards.title
})

ChannelsPage.load = ({ dispatch }) => dispatch(getChannels({ all: true }))

function ChannelsList({ className, children }) {
	// On `8ch.net` there're about 20 000 user-created boards.
	// Such a long list would render very slowly without virtualization.
	return (
		<VirtualScroller
			items={children}
			itemComponent={ChannelsListChannel}
			className={className}/>
	)
}

ChannelsList.propTypes = {
	className: PropTypes.string,
	children: PropTypes.arrayOf(PropTypes.shape({
		key: PropTypes.string.isRequired,
		channel: channelType
	})).isRequired
}

function ChannelsListChannel({ children: { channel } }) {
	return (
		<Link
			to={getUrl(channel.id)}
			className="ChannelsListChannel">
			<div className="ChannelsListChannel-url">
				<ChannelUrl channelId={channel.id}/>
			</div>
			<div className="ChannelsListChannel-title">
				{channel.title}
			</div>
		</Link>
	)
}

ChannelsListChannel.propTypes = {
	children: PropTypes.object.isRequired
}

// Using `React.memo()` so that `virtual-scroller`
// doesn't re-render items as the user scrolls.
ChannelsListChannel = React.memo(ChannelsListChannel)