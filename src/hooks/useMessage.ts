import type { MessageType } from '@/types'

import React, { ReactElement, useMemo } from 'react'

import useMessage_ from 'frontend-lib/hooks/useMessage.js'

import useLocale from './useLocale.js'

export default function useMessage(
	messageLabel: string,
	parameters?: Record<string, any>,
	options?: Record<string, any>
): MessageType | undefined {
	const locale = useLocale()

	const optionsWithLocale = useMemo(() => ({
		...options,
		locale
	}), [
		options,
		locale
	])

	const message = useMessage_(messageLabel, parameters, optionsWithLocale) as MessageType | undefined
	if (message) {
		return addReactKeys(message)
	}
}

// Works around React error message:
// "Warning: Each child in a list should have a unique "key" prop."
export function addReactKeys(message: MessageType) {
	if (typeof message === 'string') {
		return message
	} else {
		return message.map((child, i) => {
			if (typeof child === 'string') {
				return React.createElement('span', { key: i }, child)
			}
			if (React.isValidElement(child)) {
				return React.cloneElement(child as ReactElement, { key: i })
			}
			// `child` could be anything that is returned from a "tag" function when using a tag in a message.
			return child
		})
	}
}