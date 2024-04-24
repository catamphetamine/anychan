import type { DataSource } from '../types/index.js'

import React, { useContext } from 'react'

export const DataSourceContext = React.createContext(undefined)

export default function useDataSource() {
	return useContext(DataSourceContext) as DataSource
}