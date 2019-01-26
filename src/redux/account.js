import { ReduxModule } from 'react-website'

const redux = new ReduxModule()

export const getAccount = redux.action
(
	(id) => async http => http.get(`api://accounts/${id}`),
	'account'
)

export const getAccountPosts = redux.action
(
	(id) => async http => http.get(`api://accounts/${id}/posts`),
	'posts'
)

export const uploadPicture = redux.action
(
	(file) => (http) => http.post(`api://images/upload`, { file })
)

// export const setNewBackgroundPicture = redux.simpleAction
// (
// 	picture => picture,
// 	(state, picture) => ({
// 		...state,
// 		// uploadingNewBackgroundPicture : false,
// 		newBackgroundPicture : picture
// 	})
// )

// export const setNewAccountPicture = redux.simpleAction
// (
// 	picture => picture,
// 	(state, picture) => ({
// 		...state,
// 		// uploadingNewAccountPicture : false,
// 		newAccountPicture : picture
// 	})
// )

export const getLatestActivityTime = redux.action
(
	(id) => async http =>
	{
		return new Date()
		// return await http.get('api://example/users')
	},
	'latestActivityTime'
)

export default redux.reducer()