import { useMemo } from 'react'

import useMessageFormatter_ from 'frontend-lib/hooks/useMessageFormatter.js'

import useLocale from './useLocale.js'

export default function useMessageFormatter(messageLabel, options) {
	const locale = useLocale()

	const optionsWithLocale = useMemo(() => ({
		...options,
		locale
	}), [
		options,
		locale
	])

	return useMessageFormatter_(messageLabel, optionsWithLocale)
}