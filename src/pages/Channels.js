import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import ChannelsListVirtualized from '../components/ChannelsList/ChannelsListVirtualized.js'
import ChannelUrl from '../components/ChannelUrl.js'

import { getChannels } from '../redux/data.js'

import getMessages from '../messages/index.js'

import useMessages from '../hooks/useMessages.js'
import useSetting from '../hooks/useSetting.js'

import { getContext } from '../context.js'

import './Channels.css'

export default function ChannelsPage() {
	const {
		channels,
		channelsByCategory,
		channelsByPopularity
	} = useSelector(state => state.data.allChannels)

	return (
		<section className="ChannelsPage Content Content--text">
			<ChannelsListVirtualized
				showAllChannels
				channels={channels}
				channelsByPopularity={channelsByPopularity}
				channelsByCategory={channelsByCategory}
			/>
		</section>
	)
}

ChannelsPage.meta = ({ useSelector }) => {
	const messages = useMessages({ useSelector })
	return {
		title: messages.boards.title
	}
}

ChannelsPage.load = async ({ dispatch, useSelector }) => {
	const {
		userSettings,
		dataSource
	} = getContext()

	const useSetting_ = (getter) => useSetting(getter, { useSelector })
	const locale = useSetting_(settings => settings.locale)

	await dispatch(getChannels({
		all: true,
		userSettings,
		dataSource,
		messages: getMessages(locale)
	}))
}