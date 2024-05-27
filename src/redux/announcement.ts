import type { State } from '@/types'

import { ReduxModule } from 'react-pages'

// This redux module name is used in tests so don't remove it.
const redux = new ReduxModule<State['announcement']>('ANNOUNCEMENT')

export const setAnnouncement = redux.simpleAction(
	// This redux action name is used in tests so don't remove it.
	'SET_ANNOUNCEMENT',
	(state, announcement) => ({
		...state,
		announcement
	})
)

export const markAnnouncementAsRead = redux.simpleAction(
	(state) => ({
		...state,
		announcement: {
			...state.announcement,
			read: true
		}
	})
)

export default redux.reducer()