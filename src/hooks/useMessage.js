import { useMemo } from 'react'

import useMessage_ from 'frontend-lib/hooks/useMessage.js'

import useLocale from './useLocale.js'

export default function useMessage(messageLabel, parameters, options) {
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