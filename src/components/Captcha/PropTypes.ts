import PropTypes from 'prop-types'

export const imageTextCaptchaType = PropTypes.shape({
	id: PropTypes.string.isRequired,
	type: PropTypes.oneOf(['text']).isRequired,
	challengeType: PropTypes.oneOf(['image']).isRequired,
	characterSet: PropTypes.string,
	expiresAt: PropTypes.instanceOf(Date).isRequired,
	image: PropTypes.shape({
		type: PropTypes.string.isRequired,
		url: PropTypes.string.isRequired,
		width: PropTypes.number.isRequired,
		height: PropTypes.number.isRequired
	}).isRequired
})

export const imageSliderTextCaptchaType = PropTypes.shape({
	type: PropTypes.oneOf(['text']).isRequired,
	challengeType: PropTypes.oneOf(['image-slider']).isRequired
})

export const frameCaptchaType = PropTypes.shape({
	type: PropTypes.oneOf(['frame']).isRequired,
	frameUrl: PropTypes.string.isRequired
})

export const textCaptchaType = PropTypes.oneOfType([
	imageTextCaptchaType,
	imageSliderTextCaptchaType
])