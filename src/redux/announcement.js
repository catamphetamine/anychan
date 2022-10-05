import { ReduxModule } from 'react-pages'

const redux = new ReduxModule('ANNOUNCEMENT')

export const setAnnouncement = redux.simpleAction(
	'SET_ANNOUNCEMENT',
	(state, announcement) => ({
		...state,
		announcement
	})
)

export const markAnnouncementAsRead = redux.simpleAction(
	(state, announcement) => ({
		...state,
		announcement: {
			...announcement,
			read: true
		}
	})
)

export default redux.reducer()