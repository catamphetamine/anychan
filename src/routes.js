import React from 'react'
import { Route, Redirect } from 'react-website'

import Application from './pages/Application'
import Main from './pages/Main'
import Board from './pages/Board'
import Thread from './pages/Thread'
import Settings from './pages/Settings'

import { createErrorPagesRoutes } from 'webapp-frontend/src/routes.common'

export default(
	<Route
		path="/"
		Component={Application}>

		<Route
			Component={Main}/>

		<Route
			path="profile"
			Component={Settings}/>

		{createErrorPagesRoutes()}

		<Route
			path=":board"
			Component={Board}/>

		<Route
			path=":board/:thread"
			Component={Thread}/>
	</Route>
)