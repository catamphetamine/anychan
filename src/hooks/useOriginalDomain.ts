import React, { useContext } from 'react'

export const OriginalDomainContext = React.createContext(undefined)

export default function useOriginalDomain(): string | undefined {
	return useContext(OriginalDomainContext)
}