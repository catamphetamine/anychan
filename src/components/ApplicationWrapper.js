import React, { StrictMode } from 'react'
import PropTypes from 'prop-types'
import { Provider as ReduxProvider } from 'react-redux'

export default function ApplicationWrapper({ store, children }) {
	return (
		<StrictMode>
			<ReduxProvider store={store}>
				{children}
			</ReduxProvider>
		</StrictMode>
	)
}

ApplicationWrapper.propTypes = {
	store: PropTypes.object.isRequired
}