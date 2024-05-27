import type { Channel } from '@/types'

import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-pages'
import classNames from 'classnames'

import ChannelUrl from '../ChannelUrl.js'

import { channelShape } from './ChannelsList.propTypes.js'

import getUrl from '../../utility/getUrl.js'

export default function Channel({
	channel,
	isSelected
}: ChannelProps) {
	const [isHovered, setHovered] = useState(false)
	const [isActive, setActive] = useState(false)

	// https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/pointerout_event
	// The pointerout event is fired for several reasons including:
	// * pointing device is moved out of the hit test boundaries of an element (`pointerleave`);
	// * firing the pointerup event for a device that does not support hover (see `pointerup`);
	// * after firing the pointercancel event (see `pointercancel`);
	// * when a pen stylus leaves the hover range detectable by the digitizer.
	const onPointerEnter = useCallback(() => setHovered(true), [])
	const onPointerOut = useCallback(() => {
		setHovered(false)
		setActive(false)
	}, [])
	const onPointerDown = useCallback(() => setActive(true), [])
	const onPointerUp = useCallback(() => setActive(false), [])
	const onDragStart = onPointerOut

	// Safari doesn't support pointer events.
	// https://caniuse.com/#feat=pointer
	// https://webkit.org/status/#?search=pointer%20events
	// onPointerDown={onPointerDown}
	// onPointerUp={onPointerUp}
	// onPointerEnter={onPointerEnter}
	// onPointerOut={onPointerOut}
	return (
		<React.Fragment>
			<Link
				to={getUrl(channel.id)}
				tabIndex={-1}
				onDragStart={onDragStart}
				onMouseDown={onPointerDown}
				onMouseUp={onPointerUp}
				onMouseEnter={onPointerEnter}
				onMouseLeave={onPointerOut}
				className={classNames('ChannelsListChannel-url', {
					'ChannelsListChannel-url--selected': isSelected,
					'ChannelsListChannel-url--hover': isHovered,
					'ChannelsListChannel-url--active': isActive
				})}>
				<ChannelUrl
					channelId={channel.id}
					selected={isSelected}
					hovered={isHovered}
					active={isActive}/>
			</Link>
			<Link
				to={getUrl(channel.id)}
				onDragStart={onDragStart}
				onMouseDown={onPointerDown}
				onMouseUp={onPointerUp}
				onMouseEnter={onPointerEnter}
				onMouseLeave={onPointerOut}
				className={classNames('ChannelsListChannel-title', {
					'ChannelsListChannel-title--selected': isSelected,
					'ChannelsListChannel-title--hover': isHovered,
					'ChannelsListChannel-title--active': isActive
				})}>
				{channel.title || ''}
			</Link>
		</React.Fragment>
	)
}

Channel.propTypes = {
	channel: PropTypes.shape(channelShape).isRequired,
	isSelected: PropTypes.bool
}

interface ChannelProps {
	channel: Channel,
	isSelected?: boolean
}