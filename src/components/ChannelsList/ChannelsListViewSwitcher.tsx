import type { ChannelsListView } from '@/types'

import React, { useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'

// @ts-expect-error
import { Select } from 'react-responsive-ui'

import useMessages from '../../hooks/useMessages.js'

export default function ChannelsListViewSwitcher({
	view,
	onViewChange
}: ChannelsListViewSwitcherProps) {
	const messages = useMessages()

	const options = useMemo(() => {
		return [{
			value: 'list',
			label: messages.boards.byPopularity
		}, {
			value: 'by-category',
			label: messages.boards.byCategory
		}]
	}, [messages])

	const onChange = useCallback((value: ChannelsListView) => {
		switch (value) {
			case 'list':
				onViewChange('list')
				return
			case 'by-category':
				onViewChange('by-category')
				return
		}
	}, [
		onViewChange
	])

	return (
		<div className="ChannelsListViewSwitcher">
			<Select
				value={view}
				onChange={onChange}
				options={options}
			/>
		</div>
	)
}

ChannelsListViewSwitcher.propTypes = {
	view: PropTypes.oneOf(['list', 'by-category']).isRequired,
	onViewChange: PropTypes.func.isRequired
}

interface ChannelsListViewSwitcherProps {
	view: ChannelsListView;
	onViewChange: (view: ChannelsListView) => void;
}