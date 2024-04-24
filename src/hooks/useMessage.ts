import { useMemo } from 'react'

import useMessage_ from 'frontend-lib/hooks/useMessage.js'

import useLocale from './useLocale.js'

export default function useMessage(messageLabel: string, parameters?: Record<string, any>, options?: Record<string, any>): string | undefined {
	const locale = useLocale()

	const optionsWithLocale = useMemo(() => ({
		...options,
		locale
	}), [
		options,
		locale
	])

	return useMessage_(messageLabel, parameters, optionsWithLocale)
}