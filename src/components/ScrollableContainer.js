import React from 'react'
import PropTypes from 'prop-types'

import SimpleBar from 'simplebar-react'

const ScrollableContainer = React.forwardRef(({
	style,
	maxHeight,
	children
}, ref) => {
	return (
		<SimpleBar style={style} ref={ref}>
			{children}
		</SimpleBar>
	)
})

ScrollableContainer.propTypes = {
	style: PropTypes.object,
	maxHeight: PropTypes.number,
	children: PropTypes.node.isRequired
}

export default ScrollableContainer

export function getScrollableContainerHeight(scrollableContainer) {
	return scrollableContainer.el.offsetHeight
}

export function getScrollableContainerScrollY(scrollableContainer) {
	return scrollableContainer.contentWrapperEl.scrollTop
}

export function setScrollableContainerScrollY(scrollableContainer, scrollY) {
	scrollableContainer.contentWrapperEl.scrollTop = scrollY
}