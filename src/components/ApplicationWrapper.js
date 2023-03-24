import React, { StrictMode } from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'

export default function ApplicationWrapper({ store, children }) {
	return (
		<StrictMode>
			<Provider store={store}>
				{children}
			</Provider>
		</StrictMode>
	)
}

ApplicationWrapper.propTypes = {
	store: PropTypes.object.isRequired
}