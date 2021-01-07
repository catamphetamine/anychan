import { ReduxModule } from 'react-pages'

const redux = new ReduxModule('TWITTER')

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

export default redux.reducer()