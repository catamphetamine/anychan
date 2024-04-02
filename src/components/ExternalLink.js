import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './ExternalLink.css'

function ExternalLink({
	fill,
	openInNewTab,
	url,
	children
}, ref) {
	return (
		<a
			ref={ref}
			target={openInNewTab ? '_blank' : undefined}
			href={url}
			className={classNames({
				'ExternalLink--fill': fill
			})}>
			{children}
		</a>
	)
}

ExternalLink = React.forwardRef(ExternalLink)

ExternalLink.propTypes = {
	fill: PropTypes.bool,
	openInNewTab: PropTypes.bool,
	url: PropTypes.string.isRequired
}

export default ExternalLink