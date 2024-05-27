import type { TypedUseSelectorHook } from 'react-redux'
import type { State } from '@/types'

import { useSelector as useSelectorUntyped } from 'react-redux'

const useSelector: TypedUseSelectorHook<State> = useSelectorUntyped<State>

export default useSelector