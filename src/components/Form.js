import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { showError } from '../redux/notifications.js'

import { Form as Form_ } from 'frontend-lib/components/Form.js'
export { Field, Submit } from 'frontend-lib/components/Form.js'

export const Form = React.forwardRef((props, ref) => {
	const dispatch = useDispatch()

	const onError = useCallback((error) => {
		console.error(error)
		dispatch(showError(error))
	}, [dispatch])

	return (
		<Form_
			ref={ref}
			{...props}
			onError={onError}
		/>
	)
})
