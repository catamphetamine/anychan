import type { ReactNode } from 'react'
import type { Store } from 'redux'

import React, { StrictMode } from 'react'
import PropTypes from 'prop-types'
import { Provider as ReduxProvider } from 'react-redux'

export default function ApplicationWrapper({
	store,
	children
}: ApplicationWrapperProps) {
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

interface ApplicationWrapperProps {
	store: Store,
	children: ReactNode
}