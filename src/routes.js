import React from 'react'
import { Route, Redirect } from 'react-website'

import Application from './pages/Application'
import Main from './pages/Main'

import { createErrorPagesRoutes } from 'webapp-frontend/src/routes.common'

export default(
	<Route
		path="/"
		Component={Application}>

		<Route
			Component={Main}/>

		{createErrorPagesRoutes()}
	</Route>
)