import React, { useContext } from 'react'

export const ChannelLayoutContext = React.createContext()

export default function useChannelLayout() {
	return useContext(ChannelLayoutContext)
}