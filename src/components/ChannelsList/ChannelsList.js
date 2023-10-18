import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import ChannelsListBase from './ChannelsListBase.js'
import Channel from './Channel.js'

import './ChannelsList.css'

export default function ChannelsList(props) {
	return (
		<ChannelsListBase
			{...props}
			listComponent={ChannelsListComponent}
		/>
	)
}

function ChannelsListComponent({ className, children }) {
	return (
		<div className={classNames(className, 'Channels-list--grid')}>
			{children.map((item) => (
				<ChannelsListItem {...item}/>
			))}
		</div>
	)
}

ChannelsListComponent.propTypes = {
	className: PropTypes.string,
	children: PropTypes.arrayOf(PropTypes.shape({
		channel: PropTypes.object,
		selected: PropTypes.bool,
		first: PropTypes.bool,
		category: PropTypes.string
	})).isRequired
}

function ChannelsListItem({
	category,
	channel,
	selected,
	first
}) {
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
	channel: PropTypes.object,
	category: PropTypes.string,
	selected: PropTypes.bool,
	first: PropTypes.bool
}

// Re-rendering the full `<Channels/>` list is about `150` ms (which is a lot).
// (seems that rendering a `<Link/>` is a long time).
ChannelsListItem = React.memo(ChannelsListItem)
