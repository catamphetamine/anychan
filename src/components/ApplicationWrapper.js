import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'

export default function ApplicationWrapper({ store, children }) {
	return (
		<Provider store={store}>
			{children}
		</Provider>
	)
}

ApplicationWrapper.propTypes = {
	store: PropTypes.object.isRequired
}