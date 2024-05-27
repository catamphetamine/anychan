import type { State, PageStateReducerName } from '@/types'

import { usePageStateSelectorOutsideOfPage } from 'react-pages'

export default function usePageStateSelectorOutsideOfPage_<
	Selector extends (state: State) => unknown = (state: State) => unknown
>(key: PageStateReducerName, selector: Selector) {
	return usePageStateSelectorOutsideOfPage(key, selector)
}