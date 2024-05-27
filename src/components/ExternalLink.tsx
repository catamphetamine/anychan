import React, { ReactNode } from 'react'
import PropTypes from 'prop-types'
// import classNames from 'classnames'

import './ExternalLink.css'

const ExternalLink = React.forwardRef<HTMLAnchorElement, ExternalLinkProps>(({
	openInNewTab,
	url,
	children,
	...rest
}, ref) => {
	return (
		<a
			{...rest}
			ref={ref}
			target={openInNewTab ? '_blank' : undefined}
			href={url}>
			{children}
		</a>
	)
})

ExternalLink.propTypes = {
	openInNewTab: PropTypes.bool,
	url: PropTypes.string.isRequired,
	children: PropTypes.node.isRequired
}

interface ExternalLinkProps {
	openInNewTab?: boolean,
	url: string,
	children: ReactNode
}

export default ExternalLink