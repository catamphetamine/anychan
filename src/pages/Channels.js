import React from 'react'
import { Link } from 'react-pages'
import { useSelector } from 'react-redux'
import VirtualScroller from 'virtual-scroller/react'

import { Channels } from '../components/Channels'
import ChannelUrl from '../components/ChannelUrl'
import { getChannels } from '../redux/data'
import getUrl from '../utility/getUrl'

import getMessages from '../messages'

import './Channels.css'

export default function ChannelsPage() {
	const locale = useSelector(({ settings }) => settings.settings.locale)
	const channels = useSelector(({ data }) => data.allChannels.channels)
	const channelsByCategory = useSelector(({ data }) => data.allChannels.channelsByCategory)
	const channelsByPopularity = useSelector(({ data }) => data.allChannels.channelsByPopularity)
	return (
		<section className="ChannelsPage Content Content--text">
			<Channels
				locale={locale}
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
		channel: PropTypes.object
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