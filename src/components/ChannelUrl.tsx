import type { ChannelId } from '@/types'

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './ChannelUrl.css'

export default function ChannelUrl({
	channelId,
	selected,
	hovered,
	active,
	className,
	...rest
}: ChannelUrlProps) {
	// Using `<span/>` instead of `<div/>`
	// because a `<button/>` can't contain a `<div/>`
	// and `<ChannelUrl/>` is used in `optionComponent` of `<Autocomplete/>`.
	return (
		<span
			{...rest}
			className={classNames(className, 'ChannelUrl', {
				'ChannelUrl--selected': selected,
				'ChannelUrl--hover': hovered,
				'ChannelUrl--active': active
			})}>
			{channelId}
		</span>
	)
}

ChannelUrl.propTypes = {
	channelId: PropTypes.string.isRequired,
	selected: PropTypes.bool,
	hovered: PropTypes.bool,
	active: PropTypes.bool,
	className: PropTypes.string
}

interface ChannelUrlProps {
	channelId: ChannelId,
	selected?: boolean,
	hovered?: boolean,
	active?: boolean,
	className?: string
}