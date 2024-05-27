import type { State } from '@/types'

import { ReduxModule } from 'react-pages'

const redux = new ReduxModule<State['twitter']>()

export const showTweet = redux.simpleAction(
	(state, { id, url }) => ({
		...state,
		tweetId: id,
		tweetUrl: url
	})
)

export const hideTweet = redux.simpleAction(
	(state) => ({
		...state,
		tweetId: undefined,
		tweetUrl: undefined
	})
)

export const setLoadingTweet = redux.simpleAction(
	(state, isLoading) => ({ ...state, isLoading })
)

export default redux.reducer()