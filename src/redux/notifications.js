import { ReduxModule } from 'react-pages'

const redux = new ReduxModule('NOTIFICATIONS')

const setNotification = redux.simpleAction(
	(state, notification) => ({
		...state,
		notification
	})
)

export const notify = (content, options) => {
	return setNotification({ content, ...options })
}

export const showError = (content, options) => {
	if (typeof content !== 'string') {
		if (content.message) {
			content = content.message
		} else {
			content = JSON.stringify(content, null, 2)
		}
	}
	return setNotification({ content, type: 'critical', ...options })
}

export default redux.reducer()