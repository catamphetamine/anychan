import type { State, PageStateReducerName } from '@/types'

import { usePageStateSelector } from 'react-pages'

export default function usePageStateSelector_<
	Selector extends (state: State) => unknown = (state: State) => unknown
>(key: PageStateReducerName, selector: Selector) {
	return usePageStateSelector(key, selector)
}