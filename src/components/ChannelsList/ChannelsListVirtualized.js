import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-pages'

import VirtualScroller from 'virtual-scroller/react'

import ChannelsListBase from './ChannelsListBase.js'
import ChannelUrl from '../ChannelUrl.js'

import getUrl from '../../utility/getUrl.js'

import { channel as channelType } from '../../PropTypes.js'

export default function ChannelsListVirtualized(props) {
	return (
		<ChannelsListBase
			{...props}
			listComponent={ChannelsListComponent}
		/>
	)
}

function ChannelsListComponent({ className, children }) {
	// On `8ch.net` there're about 20 000 user-created boards.
	// Such a long list would render very slowly without virtualization.
	return (
		<VirtualScroller
			items={children}
			itemComponent={ChannelsListItem}
			className={className}
		/>
	)
}

ChannelsListComponent.propTypes = {
	className: PropTypes.string,
	children: PropTypes.arrayOf(PropTypes.shape({
		key: PropTypes.string.isRequired,
		channel: channelType
	})).isRequired
}

function ChannelsListItem({ children: { channel } }) {
	return (
		<Link
			to={getUrl(channel.id)}
			className="ChannelsListChannel">
			<div className="ChannelsListChannel-url">
				<ChannelUrl channelId={channel.id}/>
			</div>
			{channel.title &&
				<div className="ChannelsListChannel-title">
					{channel.title}
				</div>
			}
		</Link>
	)
}

ChannelsListItem.propTypes = {
	children: PropTypes.object.isRequired
}

// Using `React.memo()` so that `virtual-scroller`
// doesn't re-render items as the user scrolls.
ChannelsListItem = React.memo(ChannelsListItem)