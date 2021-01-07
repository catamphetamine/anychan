import { ReduxModule } from 'react-pages'

import { getAnnouncement } from '../utility/announcement'

const redux = new ReduxModule()

export const setAnnouncement = redux.simpleAction(
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

export default redux.reducer({
	announcement: getAnnouncement()
})