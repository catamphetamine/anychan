const delayedDispatchActions = []
let dispatch

export function delayedDispatch(action) {
	if (dispatch) {
		return dispatch(action)
	} else {
		delayedDispatchActions.push(action)
	}
}

export function dispatchDelayedActions(_dispatch) {
	dispatch = _dispatch
	const result = {
		actions: delayedDispatchActions.slice(),
		result: delayedDispatchActions.map(dispatch)
	}
	delayedDispatchActions.splice(0, delayedDispatchActions.length)
	return result
}