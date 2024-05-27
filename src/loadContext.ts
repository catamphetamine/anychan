import type { DataSource, LoadContext } from '@/types'
import type { Dispatch } from 'redux'

import createAndInitUserData from './utility/createAndInitUserData.js'
import createAndInitUserSettings from './utility/createAndInitUserSettings.js'

// "Load context" is a `context` object parameter that gets passed to `load()` functions.
// It's a feature of `react-pages` library: if `getLoadContext()` function gets passed to
// client-side `render()` function, the result of calling that function will be the `context` parameter
// that gets passed to `load()` functions.
//
// This function creates a `getLoadContext()` function for the client-side `render()` function.
//
export function createLoadContextGetterFunction({
	dataSource,
	dataSourceAlias,
	multiDataSource,
	originalDomain
}: {
	dataSource: DataSource,
	dataSourceAlias?: string,
	multiDataSource: boolean,
	originalDomain?: string
}): (parameters: { dispatch: Dispatch }) => LoadContext {
	return ({ dispatch }) => {
		const {
			userSettings
		} = createAndInitUserSettings({
			dataSource,
			multiDataSource,
			dispatch
		})

		const {
			userData,
			userDataForUserDataCleaner
		} = createAndInitUserData({
			dataSource,
			multiDataSource,
			userSettings,
			dispatch
		})

		return {
			userSettings,
			userData,
			userDataForUserDataCleaner,
			dataSource,
			dataSourceAlias,
			multiDataSource,
			originalDomain
		}
	}
}