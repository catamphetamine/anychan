const delayedDispatchActions = []

let dispatch

export function delayedDispatch(action) {
	if (typeof window === 'undefined') {
		throw new Error('Client side only')
	}
	if (dispatch) {
		return dispatch(action)
	} else {
		return new Promise((resolve, reject) => {
			delayedDispatchActions.push({ action, resolve })
		})
	}
}

export function onDispatchReady(_dispatch) {
	if (typeof window === 'undefined') {
		throw new Error('Client side only')
	}

	dispatch = _dispatch

	const actions = delayedDispatchActions.slice()
	delayedDispatchActions.splice(0, actions.length)

	for (const { action, resolve } of actions) {
		resolve(dispatch(action))
	}
}