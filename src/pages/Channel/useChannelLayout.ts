import type { ChannelLayout } from '@/types'

import { createContext, useContext } from 'react'

export const ChannelLayoutContext = createContext<ChannelLayout>(undefined)

export default function useChannelLayout() {
	return useContext(ChannelLayoutContext)
}