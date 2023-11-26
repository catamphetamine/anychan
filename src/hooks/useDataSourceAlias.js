import React, { useContext } from 'react'

export const DataSourceAliasContext = React.createContext()

export default function useDataSourceAlias() {
	return useContext(DataSourceAliasContext)
}