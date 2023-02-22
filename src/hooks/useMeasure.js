import React, { useContext } from 'react'

export const MeasureContext = React.createContext()

export default function useMeasure() {
	return useContext(MeasureContext)
}