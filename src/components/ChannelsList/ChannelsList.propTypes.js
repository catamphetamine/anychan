import PropTypes from 'prop-types'

export const channelShape = {
	id: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	description: PropTypes.string,
	commentsPerHour: PropTypes.number
}