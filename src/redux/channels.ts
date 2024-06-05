import type { State, Channel, DataSource } from '@/types';

import { ReduxModule } from 'react-pages'

import getChannelsStateProperties from '@/utility/channel/getChannelsStateProperties.js';

const redux = new ReduxModule<State['channels']>()

export const setChannels = redux.simpleAction(
	(state, {
		channels,
		dataSource
	}: {
		channels: Channel[],
		dataSource: DataSource
	}) => {
		return {
			...state,
			...getChannelsStateProperties(channels, { dataSource })
		}
	}
)

export default redux.reducer()