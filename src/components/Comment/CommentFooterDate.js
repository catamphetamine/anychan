import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import ReactTimeAgo from 'react-time-ago'
import { Tooltip } from 'react-responsive-ui'

import PostSelfLink from 'social-components-react/components/PostSelfLink.js'
import CommentFooterSeparator from './CommentFooterSeparator.js'

import './../Tooltip.css'
import './CommentFooterDate.css'

export default function CommentFooterDate({
	postLinkProps,
	hasAnythingBeforeTime,
	hasAnythingAfterTime,
	...rest
}) {
	const _wrapperProps = useMemo(() => ({
		postLinkProps,
		hasAnythingBeforeTime,
		hasAnythingAfterTime
	}), [
		postLinkProps,
		hasAnythingBeforeTime,
		hasAnythingAfterTime
	])
	return (
		<ReactTimeAgo
			{...rest}
			wrapperComponent={TooltipContainer}
			wrapperProps={_wrapperProps}
			tooltip={false}
			timeStyle="twitter-first-minute"/>
	)
}

CommentFooterDate.propTypes = {
	postLinkProps: PropTypes.object.isRequired,
	hasAnythingBeforeTime: PropTypes.bool.isRequired,
	hasAnythingAfterTime: PropTypes.bool.isRequired
}

function TooltipContainer({
	postLinkProps,
	hasAnythingBeforeTime,
	hasAnythingAfterTime,
	verboseDate,
	children,
	...rest
}) {
	// If `<time/>` is empty due to the interval being less than 1 minute,
	// then don't render the whole time element.
	if (!children.props.children) {
		// return null;
		// Won't return `null`, because that way the footer height
		// would be different from how it would be when there was time.
		// Therefore, render an invisible time placeholder instead.
		return (
			<PostSelfLink {...postLinkProps} className="CommentFooterDate--hidden">
				.
			</PostSelfLink>
		);
	}
	return (
		<React.Fragment>
			{hasAnythingBeforeTime &&
				<CommentFooterSeparator/>
			}
			<Tooltip
				{...rest}
				placement="bottom"
				offsetTop={4}
				tooltipClassName={classNames('Tooltip', 'CommentFooterDate-tooltip')}
				content={verboseDate}>
				<PostSelfLink {...postLinkProps}>
					{children}
				</PostSelfLink>
			</Tooltip>
			{hasAnythingAfterTime &&
				<CommentFooterSeparator/>
			}
		</React.Fragment>
	)
}

TooltipContainer.propTypes = {
	postLinkProps: PropTypes.object.isRequired,
	hasAnythingBeforeTime: PropTypes.bool.isRequired,
	hasAnythingAfterTime: PropTypes.bool.isRequired,
	verboseDate: PropTypes.string,
	children: PropTypes.node.isRequired
}