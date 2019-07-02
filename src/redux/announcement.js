import { ReduxModule } from 'react-website'

import { hideAnnouncement as _hideAnnouncement } from '../utility/announcement'

const redux = new ReduxModule()

export const showAnnouncement = redux.simpleAction(
	(state, announcement) => ({ ...state, announcement })
)

export const hideAnnouncement = redux.simpleAction(
	(state) => {
		_hideAnnouncement(state.announcement)
		return { ...state, announcement: undefined }
	}
)

export default redux.reducer()