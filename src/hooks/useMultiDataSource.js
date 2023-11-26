import React, { useContext } from 'react'

export const MultiDataSourceContext = React.createContext()

export default function useMultiDataSource() {
	return useContext(MultiDataSourceContext)
}