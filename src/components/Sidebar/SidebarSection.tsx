import React, { ElementType, ReactNode, RefObject } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import SidebarSectionActionButton from './SidebarSectionActionButton.js'
import SidebarSectionMoreButton from './SidebarSectionMoreButton.js'

import './SidebarSection.css'

export default function SidebarSection({
	title,
	actions,
	moreLabel,
	onMore,
	moreButtonRef,
	marginTop,
	marginBottom,
	className,
	children,
	...rest
}: SidebarSectionProps) {
	return (
		<section {...rest} className={classNames(className, 'SidebarSection', {
			'SidebarSection--withTitle': title,
			'SidebarSection--noMarginTop': marginTop === false,
			'SidebarSection--noMarginBottom': marginBottom === false
		})}>
			{title &&
				<h1 className="SidebarSection-title">
					<span className="SidebarSection-titleText">
						{title}
					</span>
					{(actions || onMore) && (
						<div className="SidebarSection-actionButtons">
							{actions && actions.map((action, i) => (
								<SidebarSectionActionButton
									key={i}
									title={action.title}
									Icon={action.Icon}
									onClick={action.onClick}
								/>
							))}
							{onMore &&
								<SidebarSectionMoreButton
									ref={moreButtonRef}
									title={moreLabel}
									onClick={onMore}
								/>
							}
						</div>
					)}
				</h1>
			}
			{children}
		</section>
	)
}

SidebarSection.propTypes = {
	title: PropTypes.string,
	actions: PropTypes.arrayOf(PropTypes.shape({
		title: PropTypes.string.isRequired,
		onClick: PropTypes.func.isRequired,
		Icon: PropTypes.elementType.isRequired
	})),
	moreLabel: PropTypes.string,
	onMore: PropTypes.func,
	moreButtonRef: PropTypes.object,
	marginTop: PropTypes.bool,
	marginBottom: PropTypes.bool,
	className: PropTypes.string,
	children: PropTypes.node.isRequired
}

interface SidebarSectionProps {
	title?: string,
	actions?: Array<{
		title: string,
		onClick: () => void,
		Icon: ElementType
	}>,
	moreLabel?: string,
	onMore?: (isPressed: boolean) => void,
	moreButtonRef?: RefObject<HTMLButtonElement>,
	marginTop?: boolean,
	marginBottom?: boolean,
	className?: string,
	children: ReactNode
}