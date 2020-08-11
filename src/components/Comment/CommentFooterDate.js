import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import ReactTimeAgo from 'react-time-ago'
import { Tooltip } from 'react-responsive-ui'

import PostSelfLink from 'webapp-frontend/src/components/PostSelfLink'
import CommentFooterSeparator from './CommentFooterSeparator'

import './../Tooltip.css'
import './CommentFooterDate.css'

export default function CommentFooterDate({
	postLinkProps,
	hasAnythingBeforeTime,
	...rest
}) {
	const _wrapperProps = useMemo(() => ({
		postLinkProps,
		hasAnythingBeforeTime
	}), [
		postLinkProps,
		hasAnythingBeforeTime
	])
	return (
		<ReactTimeAgo
			{...rest}
			wrapperComponent={TooltipContainer}
			wrapperProps={_wrapperProps}
			tooltip={false}/>
	)
}

CommentFooterDate.propTypes = {
	postLinkProps: PropTypes.object.isRequired,
	hasAnythingBeforeTime: PropTypes.bool.isRequired
}

function TooltipContainer({
	postLinkProps,
	hasAnythingBeforeTime,
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
		</React.Fragment>
	)
}

TooltipContainer.propTypes = {
	postLinkProps: PropTypes.object.isRequired,
	hasAnythingBeforeTime: PropTypes.bool.isRequired,
	verboseDate: PropTypes.string,
	children: PropTypes.node.isRequired
}