import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import SidebarSectionMoreButton from './SidebarSectionMoreButton'

import './SidebarSection.css'

export default function SidebarSection({
	title,
	moreLabel,
	onMore,
	className,
	children
}) {
	return (
		<section className={classNames(className, 'sidebar-section')}>
			<h1 className="sidebar-section__title">
				{title}
				{onMore &&
					<SidebarSectionMoreButton title={moreLabel} onClick={onMore}/>
				}
			</h1>
			{children}
		</section>
	)
}

SidebarSection.propTypes = {
	title: PropTypes.string.isRequired,
	moreLabel: PropTypes.string,
	onMore: PropTypes.func,
	children: PropTypes.node.isRequired
}