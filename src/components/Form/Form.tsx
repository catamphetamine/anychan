import type { InferProps } from 'prop-types'

import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import useMessages from '../../hooks/useMessages.js'

import { showError } from '../../redux/notifications.js'

import { Form as Form_ } from 'frontend-lib/components/Form.js'

const Form = React.forwardRef((props: FormProps, ref) => {
	const dispatch = useDispatch()

	const messages = useMessages()

	const onError = useCallback((error: Error) => {
		console.error(error)
		dispatch(showError(error.message))
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

type FormProps = InferProps<typeof Form_.propTypes>

export default Form