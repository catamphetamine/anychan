import type { Messages } from '@/types'

import React, { ReactNode, useMemo } from 'react'
import PropTypes from 'prop-types'

import TextSelectionTooltip from 'frontend-lib/components/TextSelectionTooltip.js'

import Button from 'frontend-lib/components/Button.js'

export default function WithTextSelectionActions({
	onReply,
	messages,
	className,
	children
}: WithTextSelectionActionsProps) {
	const tooltipProps = useMemo(() => ({
		onReply,
		children: messages.post.reply
	}), [
		onReply,
		messages
	])

	return (
		<TextSelectionTooltip
			TooltipComponent={TextSelectionActions}
			tooltipProps={tooltipProps}
			className={className}>
			{children}
		</TextSelectionTooltip>
	)
}

WithTextSelectionActions.propTypes = {
	onReply: PropTypes.func.isRequired,
	messages: PropTypes.object.isRequired,
	className: PropTypes.string,
	children: PropTypes.node.isRequired
}

interface WithTextSelectionActionsProps {
	onReply: () => void,
	messages: Messages
	className?: string,
	children: ReactNode
}

const TextSelectionActions = React.forwardRef(({
	selection,
	onReply,
	children,
	...rest
}: TextSelectionActionsProps, ref) => {
	const onClick = () => {
		onReply({ selectedText: selection.getText() })
		selection.clear()
	}

	return (
		<Button
			ref={ref}
			{...rest}
			onClick={onClick}
			className="Comment-textSelectionTooltip">
			{children}
		</Button>
	)
})

TextSelectionActions.propTypes = {
	// @ts-expect-error
	selection: PropTypes.object.isRequired,
	onReply: PropTypes.func.isRequired,
	children: PropTypes.node.isRequired
}

interface TextSelectionActionsProps {
	selection: {
		getText: () => string,
		clear: () => void
	},
	onReply: (params: { selectedText: string }) => void,
	children: ReactNode
}