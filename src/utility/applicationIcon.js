// Imageboard icons are 192px x 192px.
// This could be configurable (hypothetically).
const DATA_SOURCE_ICON_SIZE = 192

const CIRCLE_RADIUS = 40
const CIRCLE_RADIUS_LARGE = 60
const CIRCLE_BORDER_WIDTH = 8

const CIRCLE_BACKGROUND_COLOR_PURPLE = '#b513ff'
const CIRCLE_BACKGROUND_COLOR_RED = '#FF0000'
const CIRCLE_BORDER_COLOR = '#FFFFFF'

export function updateApplicationIcon(iconUrl, { notificationsCount, notificationsAreImportant }) {
	if (notificationsCount === 0) {
		return setApplicationIcon(iconUrl)
	}
	const canvas = document.createElement('canvas')
	canvas.width = DATA_SOURCE_ICON_SIZE
	canvas.height = DATA_SOURCE_ICON_SIZE
	const ctx = canvas.getContext('2d')
	const image = new Image()
	image.src = iconUrl
	image.onload = () => {
		// Draw the original icon.
		ctx.drawImage(image, 0, 0)
		// Draw a "notification" circle around it.
		// const radius = notificationsAreImportant ? CIRCLE_RADIUS_LARGE : CIRCLE_RADIUS
		const radius = CIRCLE_RADIUS
		const centerX = canvas.width - radius - CIRCLE_BORDER_WIDTH / 2
		const centerY = canvas.height - radius - CIRCLE_BORDER_WIDTH / 2
		const circleBackgroundColor = notificationsAreImportant ? CIRCLE_BACKGROUND_COLOR_RED : CIRCLE_BACKGROUND_COLOR_PURPLE
		ctx.beginPath()
		ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false)
		ctx.fillStyle = circleBackgroundColor
		ctx.fill()
		ctx.lineWidth = CIRCLE_BORDER_WIDTH
		ctx.strokeStyle = CIRCLE_BORDER_COLOR
		ctx.stroke()
		// Apply the icon.
		setApplicationIcon(canvas.toDataURL('image/x-icon'))
	}
}

function setApplicationIcon(iconUrl) {
	const iconLink = document.querySelector('link[rel="shortcut icon"]')
	iconLink.href = iconUrl
}