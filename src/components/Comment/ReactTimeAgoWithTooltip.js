import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import ReactTimeAgo from 'react-time-ago'
import { Tooltip } from 'react-responsive-ui'

import './../Tooltip.css'

export default function ReactTimeAgoWithTooltip({
	wrapperComponent,
	wrapperProps,
	...rest
}) {
	const _wrapperProps = useMemo(() => ({
		wrapperComponent,
		wrapperProps
	}), [
		wrapperComponent,
		wrapperProps
	])
	return (
		<ReactTimeAgo
			{...rest}
			wrapperComponent={TooltipContainer}
			wrapperProps={_wrapperProps}
			tooltip={false}/>
	)
}

function TooltipContainer({
	wrapperComponent: Wrapper,
	wrapperProps,
	verboseDate,
	children,
	...rest
}) {
	// If `<time/>` is empty due to the interval being less than 1 minute,
	// then don't render the whole time element.
	if (!children.props.children) {
		return null;
	}
	return (
		<Wrapper {...wrapperProps}>
			<Tooltip
				{...rest}
				placement="bottom"
				offsetTop={4}
				tooltipClassName="Tooltip"
				content={verboseDate}>
				{children}
			</Tooltip>
		</Wrapper>
	)
}

TooltipContainer.propTypes = {
	wrapperComponent: PropTypes.elementType.isRequired,
	wrapperProps: PropTypes.object.isRequired,
	verboseDate: PropTypes.string,
	children: PropTypes.node.isRequired
}