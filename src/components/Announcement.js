import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Close from 'webapp-frontend/assets/images/icons/close-thicker.svg'

import PostBlock from 'webapp-frontend/src/components/PostBlock'

import './Announcement.css'

export default function Announcement({ onClose, closeLabel, announcement }) {
	return (
		<div className="announcement">
			<div className="announcement__content">
				<PostBlock className="announcement__content">
					{announcement.content}
				</PostBlock>
			</div>

			<button
				type="button"
				onClick={onClose}
				title={closeLabel}
				className="announcement__close rrui__button-reset">
				<Close className="announcement__close-icon"/>
			</button>
		</div>
	)
}

Announcement.propTypes = {
	onClose: PropTypes.func.isRequired,
	closeLabel: PropTypes.string.isRequired,
	announcement: announcementPropType.isRequired
}

export const announcementPropType = PropTypes.shape({
	date: PropTypes.string.isRequired,
	content: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.object
		])),
		PropTypes.string
	]).isRequired
})