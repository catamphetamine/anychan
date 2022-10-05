import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { Form as Form_ } from 'frontend-lib/components/Form.js'
export { Field, Submit } from 'frontend-lib/components/Form.js'

export let Form = function Form(props, ref) {
	const dispatch = useDispatch()

	const onError = useCallback((error) => {
		console.error(error)
		dispatch(showError(error))
	}, [dispatch])

	return <Form_ ref={ref} {...props}/>
}

Form = React.forwardRef(Form)