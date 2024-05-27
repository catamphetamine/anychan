import type { MessageType } from '@/types'

import { useCallback, useMemo } from 'react'

import useMessageFormatter_ from 'frontend-lib/hooks/useMessageFormatter.js'

import useLocale from './useLocale.js'

import { addReactKeys } from './useMessage.js'

type MessageFormatter = (parameters?: Record<string, any>) => MessageType

export default function useMessageFormatter(messageLabel: string, options?: Record<string, any>) {
	const locale = useLocale()

	const optionsWithLocale = useMemo(() => ({
		...options,
		locale
	}), [
		options,
		locale
	])

	const messageFormatter = useMessageFormatter_(messageLabel, optionsWithLocale) as MessageFormatter

	const messageFormatterWithReactKeys = useCallback((parameters?: Record<string, any>) => {
		const message = messageFormatter(parameters)
		if (message) {
			return addReactKeys(message)
		}
	}, [
		options,
		locale
	])

	return messageFormatterWithReactKeys
}