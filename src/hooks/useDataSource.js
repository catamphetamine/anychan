import React, { useContext } from 'react'

export const DataSourceContext = React.createContext()

export default function useDataSource() {
	return useContext(DataSourceContext)
}