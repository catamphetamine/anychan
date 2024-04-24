import React, { useContext } from 'react'

export const DataSourceAliasContext = React.createContext(undefined)

export default function useDataSourceAlias(): string | undefined {
	return useContext(DataSourceAliasContext)
}