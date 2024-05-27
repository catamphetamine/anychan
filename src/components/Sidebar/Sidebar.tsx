import React, { ElementType, ReactNode } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import SimpleBar from 'simplebar-react'

import './Sidebar.css'

const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(({
	StickyHeader,
	stickyHeaderProps,
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
				<StickyHeader {...stickyHeaderProps}/>
			}
			{/* @ts-expect-error */}
			<SimpleBar className="Sidebar-scrollableList">
				{children}
			</SimpleBar>
		</section>
	)
})

Sidebar.propTypes = {
	// @ts-expect-error
	StickyHeader: PropTypes.elementType,
	stickyHeaderProps: PropTypes.object,
	className: PropTypes.string,
	children: PropTypes.node.isRequired
}

interface SidebarProps {
	StickyHeader?: ElementType,
	stickyHeaderProps?: object,
	className?: string,
	children: ReactNode
}

export default Sidebar