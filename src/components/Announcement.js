import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button } from 'react-responsive-ui'
import classNames from 'classnames'
import Close from 'webapp-frontend/assets/images/icons/close-thicker.svg'

import PostBlock from 'webapp-frontend/src/components/PostBlock'

import './Announcement.css'

export default function Announcement({
	onClose,
	closeLabel,
	onClick,
	buttonLabel,
	announcement,
	children
}) {
	return (
		<div className={classNames('announcement', {
			'announcement--button': onClick
		})}>
			<div className="announcement__content">
				<PostBlock className="announcement__content">
					{announcement ? announcement.content : children}
				</PostBlock>
			</div>

			{onClose &&
				<button
					type="button"
					onClick={onClose}
					title={closeLabel}
					className="announcement__close rrui__button-reset">
					<Close className="announcement__close-icon"/>
				</button>
			}

			{onClick &&
				<Button
					onClick={onClick}
					className="rrui__button--background">
					{buttonLabel}
				</Button>
			}
		</div>
	)
}

Announcement.propTypes = {
	onClose: PropTypes.func,
	closeLabel: PropTypes.string,
	onClick: PropTypes.func,
	buttonLabel: PropTypes.string,
	announcement: announcementPropType,
	children: contentPropType
}

const contentPropType = PropTypes.oneOfType([
	PropTypes.arrayOf(PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.object
	])),
	PropTypes.string
])

export const announcementPropType = PropTypes.shape({
	date: PropTypes.string.isRequired,
	content: contentPropType.isRequired
})