import type { Channel, Props }from '@/types'

import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-pages'

import VirtualScroller from 'virtual-scroller/react'

import ChannelsListBase from './ChannelsListBase.js'
import ChannelUrl from '../ChannelUrl.js'

import getUrl from '../../utility/getUrl.js'

import { channel as channelType } from '../../PropTypes.js'

export default function ChannelsListVirtualized(props: ChannelsListVirtualizedProps) {
	return (
		<ChannelsListBase
			{...props}
			listComponent={ChannelsListComponent}
		/>
	)
}

type ChannelsListVirtualizedProps = Omit<Props<typeof ChannelsListBase>, 'listComponent'>

function ChannelsListComponent({
	className,
	items
}: ChannelsListComponentProps) {
	// On `8ch.net` there're about 20 000 user-created boards.
	// Such a long list would render very slowly without virtualization.
	return (
		<VirtualScroller
			items={items}
			itemComponent={ChannelsListItemMemoized}
			className={className}
		/>
	)
}

ChannelsListComponent.propTypes = {
	className: PropTypes.string,
	items: PropTypes.arrayOf(PropTypes.shape({
		key: PropTypes.string.isRequired,
		channel: channelType
	})).isRequired
}

interface ChannelsListComponentProps {
	className?: string,
	items: ChannelsListItemProps['item'][]
}

const ChannelsListItem = ({ item: { channel } }: ChannelsListItemProps) => {
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
	item: PropTypes.shape({
		key: PropTypes.string.isRequired,
		channel: channelType
	}).isRequired
}

interface ChannelsListItemProps {
	item: {
		key: string,
		channel: Channel
	}
}

// Using `React.memo()` so that `virtual-scroller`
// doesn't re-render items as the user scrolls.
const ChannelsListItemMemoized = React.memo(ChannelsListItem)