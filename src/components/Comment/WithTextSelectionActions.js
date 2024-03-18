import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import TextSelectionTooltip from 'frontend-lib/components/TextSelectionTooltip.js'

import Button from 'frontend-lib/components/Button.js'

export default function WithTextSelectionActions({
	onReply,
	messages,
	className,
	children
}) {
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

function TextSelectionActions({
	selection,
	onReply,
	children,
	...rest
}, ref) {
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
}

TextSelectionActions = React.forwardRef(TextSelectionActions)

TextSelectionActions.propTypes = {
	selection: PropTypes.object.isRequired,
	onReply: PropTypes.func.isRequired
}