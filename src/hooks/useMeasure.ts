import React, { useContext } from 'react'

export const MeasureContext = React.createContext(undefined)

// Returns a function that triggers a re-measuring of page elements' dimensions.
// Can be used when switching between Dark Mode and Light Mode
// because elements' dimensions or spacings might be different in Light Mode and Dark Mode.
export default function useMeasure() {
	return useContext(MeasureContext) as () => void
}