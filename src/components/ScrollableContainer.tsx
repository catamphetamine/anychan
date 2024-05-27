import type { CSSProperties, ReactNode } from 'react'

import React from 'react'
import PropTypes from 'prop-types'

import SimpleBar from 'simplebar-react'

const ScrollableContainer = React.forwardRef<SimpleBarRefValue, ScrollableContainerProps>(({
	style,
	maxHeight,
	children
}, ref) => {
	return (
		// @ts-expect-error
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

interface ScrollableContainerProps {
	style?: CSSProperties,
	maxHeight?: number,
	children: ReactNode
}

export default ScrollableContainer

export function getScrollableContainerHeight(scrollableContainer: SimpleBarRefValue) {
	return scrollableContainer.el.offsetHeight
}

export function getScrollableContainerScrollY(scrollableContainer: SimpleBarRefValue) {
	return scrollableContainer.contentWrapperEl.scrollTop
}

export function setScrollableContainerScrollY(scrollableContainer: SimpleBarRefValue, scrollY: number) {
	scrollableContainer.contentWrapperEl.scrollTop = scrollY
}

interface SimpleBarRefValue {
	el: HTMLElement,
	contentWrapperEl: HTMLElement
}