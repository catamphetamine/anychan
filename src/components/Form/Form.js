import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import useMessages from '../../hooks/useMessages.js'

import { showError } from '../../redux/notifications.js'

import { Form as Form_ } from 'frontend-lib/components/Form.js'

const Form = React.forwardRef((props, ref) => {
	const dispatch = useDispatch()

	const messages = useMessages()

	const onError = useCallback((error) => {
		console.error(error)
		dispatch(showError(error))
	}, [dispatch])

	return (
		<Form_
			ref={ref}
			{...props}
			requiredMessage={messages.form.error.required}
			onError={onError}
		/>
	)
})

export default Form