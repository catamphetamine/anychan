import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import SimpleBar from 'simplebar-react'

import './Sidebar.css'

const Sidebar = React.forwardRef(({
	StickyHeader,
	className,
	children,
	...rest
}, ref) => {
	return (
		<section
			ref={ref}
			{...rest}
			className={classNames('Sidebar', className)}>
			{StickyHeader &&
				<StickyHeader/>
			}
			<SimpleBar className="Sidebar-scrollableList">
				{children}
			</SimpleBar>
		</section>
	)
})

Sidebar.propTypes = {
	className: PropTypes.string,
	StickyHeader: PropTypes.elementType,
	children: PropTypes.node.isRequired
}

export default Sidebar