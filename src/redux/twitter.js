import { ReduxModule } from 'react-pages'

const redux = new ReduxModule('TWITTER')

export const showTweet = redux.simpleAction(
	(state, tweetId) => ({
		...state,
		tweetId
	})
)

export const hideTweet = redux.simpleAction(
	(state) => ({
		...state,
		tweetId: undefined
	})
)

export default redux.reducer()