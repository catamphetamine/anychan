
import type { Channel as ChannelType, PropsExcept } from '@/types'

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import ChannelsListBase from './ChannelsListBase.js'
import Channel from './Channel.js'

import './ChannelsList.css'

export default function ChannelsList(props: ChannelsListProps) {
	return (
		<ChannelsListBase
			{...props}
			listComponent={ChannelsListComponent}
		/>
	)
}

type ChannelsListProps = PropsExcept<typeof ChannelsListBase, 'listComponent'>

function ChannelsListComponent({ items, className }: ChannelsListComponentProps) {
	return (
		<div className={classNames(className, 'Channels-list--grid')}>
			{items.map(({ key, ...item }) => (
				<ChannelsListItemMemoized key={key} {...item}/>
			))}
		</div>
	)
}

ChannelsListComponent.propTypes = {
	items: PropTypes.arrayOf(PropTypes.shape({
		channel: PropTypes.object,
		selected: PropTypes.bool,
		first: PropTypes.bool,
		category: PropTypes.string
	})).isRequired,
	className: PropTypes.string
}

interface ChannelsListComponentProps {
	items: {
		key: string,
		channel?: ChannelType,
		category?: string,
		selected?: boolean,
		first?: boolean
	}[],
	className?: string
}

let ChannelsListItem: React.FC<ChannelsListItemProps> = ({
	category,
	channel,
	selected,
	first
}) => {
	if (channel) {
		return (
			<Channel
				channel={channel}
				isSelected={selected}
			/>
		)
	}
	return (
		<React.Fragment key={category || '—'}>
			<div className="ChannelsListSectionHeader-urlPlaceholder"/>
			<h2 className={classNames('ChannelsListSectionHeader-title', {
				'ChannelsListSectionHeader-title--first': first
			})}>
				{category}
			</h2>
		</React.Fragment>
	)
}

ChannelsListItem.propTypes = {
	// @ts-expect-error
	channel: PropTypes.shape({
		id: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired
	}),
	category: PropTypes.string,
	selected: PropTypes.bool,
	first: PropTypes.bool
}

interface ChannelsListItemProps {
	category?: string,
	channel?: ChannelType,
	selected?: boolean,
	first?: boolean
}

// Re-rendering the full `<Channels/>` list is about `150` ms (which is a lot).
// (seems that rendering a `<Link/>` is a long time).
const ChannelsListItemMemoized = React.memo(ChannelsListItem)
