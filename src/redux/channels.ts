import type { State } from '@/types';

import { ReduxModule } from 'react-pages'

const redux = new ReduxModule<State['channels']>()

export const setChannelsResult = redux.simpleAction(
	(state, channelsResult) => ({
		...state,
		...channelsResult,
		// If `channelsResult` hypothetically has `allChannels: undefined` property
		// then prevent it from erasing potential already loaded `allChannels` in the `state`.
		allChannels: channelsResult.allChannels || state.allChannels
	})
)

export default redux.reducer()