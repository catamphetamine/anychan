import React, { useContext } from 'react'

export const MultiDataSourceContext = React.createContext(undefined)

export default function useMultiDataSource(): boolean {
	return useContext(MultiDataSourceContext)
}