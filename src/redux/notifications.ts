import type { State, NotificationContent, NotificationOptions } from '@/types'

import { ReduxModule } from 'react-pages'

const redux = new ReduxModule<State['notifications']>()

const setNotification = redux.simpleAction(
	(state, notification) => ({
		...state,
		notification
	})
)

export const notify = (content: NotificationContent, options?: NotificationOptions) => {
	return setNotification({ content, ...options })
}

export const showError = (content: NotificationContent, options?: NotificationOptions) => {
	return setNotification({ content, type: 'critical', ...options })
}

export default redux.reducer()