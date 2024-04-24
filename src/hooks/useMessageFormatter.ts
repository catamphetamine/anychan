import { useMemo } from 'react'

import useMessageFormatter_ from 'frontend-lib/hooks/useMessageFormatter.js'

import useLocale from './useLocale.js'

type MessageFormatter = (parameters?: Record<string, any>) => string

export default function useMessageFormatter(messageLabel: string, options?: Record<string, any>) {
	const locale = useLocale()

	const optionsWithLocale = useMemo(() => ({
		...options,
		locale
	}), [
		options,
		locale
	])

	return useMessageFormatter_(messageLabel, optionsWithLocale) as MessageFormatter
}