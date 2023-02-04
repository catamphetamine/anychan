import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import SidebarSectionMoreButton from './SidebarSectionMoreButton.js'

import './SidebarSection.css'

export default function SidebarSection({
	title,
	moreLabel,
	onMore,
	moreButtonRef,
	marginTop,
	marginBottom,
	className,
	children,
	...rest
}) {
	return (
		<section {...rest} className={classNames(className, 'SidebarSection', {
			'SidebarSection--withTitle': title,
			'SidebarSection--noMarginTop': marginTop === false,
			'SidebarSection--noMarginBottom': marginBottom === false
		})}>
			{title &&
				<h1 className="SidebarSection-title">
					{title}
					{onMore &&
						<SidebarSectionMoreButton
							ref={moreButtonRef}
							title={moreLabel}
							onClick={onMore}
						/>
					}
				</h1>
			}
			{children}
		</section>
	)
}

SidebarSection.propTypes = {
	title: PropTypes.string,
	moreLabel: PropTypes.string,
	onMore: PropTypes.func,
	moreButtonRef: PropTypes.object,
	marginTop: PropTypes.bool,
	marginBottom: PropTypes.bool,
	className: PropTypes.string,
	children: PropTypes.node.isRequired
}