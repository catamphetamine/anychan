import type { Thread } from '@/types'

import React from 'react'
import PropTypes from 'prop-types'

import Clickable from 'frontend-lib/components/Clickable.js'

import useUrlBasePath from '../../hooks/useUrlBasePath.js'

import getThreadUrl from '../../utility/getThreadUrl.js'

import { thread as threadType } from '../../PropTypes.js'

import PinIcon from 'frontend-lib/icons/pin.svg'

import './ChannelPinnedThreadPreview.css'

export default function ChannelPinnedThreadPreview({
	thread,
	onClick
}: {
	thread: Thread,
	onClick: (event: Event) => void
}) {
	const urlBasePath = useUrlBasePath()

	return (
		<Clickable
			cursor="pointer"
			onClick={onClick}
			url={urlBasePath + getThreadUrl(thread.channelId, thread.id)}
			className="ChannelPinnedThreadPreview">
			<PinIcon className="ChannelPinnedThreadPreview-pinIcon"/>
			<article className="ChannelPinnedThreadPreview-titleAndText">
				{(thread.titleCensored || thread.title) && !thread.autogeneratedTitle && (
					<h1 className="ChannelPinnedThreadPreview-title">
						{thread.titleCensored || thread.title}
						<br/>
					</h1>
				)}
				<p className="ChannelPinnedThreadPreview-text">
					{thread.comments[0].getContentTextSingleLine()}
				</p>
			</article>
		</Clickable>
	)
}

ChannelPinnedThreadPreview.propTypes = {
	thread: threadType.isRequired,
	onClick: PropTypes.func.isRequired
}