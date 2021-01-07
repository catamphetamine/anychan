// Imageboard icons are 192px x 192px.
// This could be configurable (hypothetically).
const PROVIDER_ICON_SIZE = 192

const CIRCLE_RADIUS = 40
const CIRCLE_BORDER_WIDTH = 8

export function updatePageIcon(iconUrl, { notificationsCount }) {
	if (notificationsCount === 0) {
		return setPageIcon(iconUrl)
	}
	const canvas = document.createElement('canvas')
	canvas.width = PROVIDER_ICON_SIZE
	canvas.height = PROVIDER_ICON_SIZE
	const ctx = canvas.getContext('2d')
	const image = new Image()
	image.src = iconUrl
	image.onload = () => {
		// Draw the original icon.
		ctx.drawImage(image, 0, 0)
		// Draw a "notification" circle around it.
		const centerX = canvas.width - CIRCLE_RADIUS - CIRCLE_BORDER_WIDTH / 2
		const centerY = canvas.height - CIRCLE_RADIUS - CIRCLE_BORDER_WIDTH / 2
		ctx.beginPath()
		ctx.arc(centerX, centerY, CIRCLE_RADIUS, 0, 2 * Math.PI, false)
		ctx.fillStyle = '#FF0000'
		ctx.fill()
		ctx.lineWidth = CIRCLE_BORDER_WIDTH
		ctx.strokeStyle = '#FFFFFF'
		ctx.stroke()
		// Apply the icon.
		setPageIcon(canvas.toDataURL('image/x-icon'))
	}
}

function setPageIcon(iconUrl) {
	const iconLink = document.querySelector('link[rel="shortcut icon"]')
	iconLink.href = iconUrl
}