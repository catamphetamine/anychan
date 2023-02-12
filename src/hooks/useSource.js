import React, { useContext } from 'react'

export const SourceContext = React.createContext()

export default function useSource() {
	return useContext(SourceContext)
}