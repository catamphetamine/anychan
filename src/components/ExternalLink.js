import React from 'react'
import PropTypes from 'prop-types'
// import classNames from 'classnames'

import './ExternalLink.css'

function ExternalLink({
	openInNewTab,
	url,
	children,
	...rest
}, ref) {
	return (
		<a
			{...rest}
			ref={ref}
			target={openInNewTab ? '_blank' : undefined}
			href={url}>
			{children}
		</a>
	)
}

ExternalLink = React.forwardRef(ExternalLink)

ExternalLink.propTypes = {
	openInNewTab: PropTypes.bool,
	url: PropTypes.string.isRequired
}

export default ExternalLink