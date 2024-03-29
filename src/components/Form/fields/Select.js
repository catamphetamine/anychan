import React from 'react'
import PropTypes from 'prop-types'

import { Select } from 'react-responsive-ui'

import ScrollableContainer, {
	getScrollableContainerHeight,
	getScrollableContainerScrollY,
	setScrollableContainerScrollY
} from '../../ScrollableContainer.js'

const SelectComponent = React.forwardRef(({
	wait,
	...rest
}, ref) => {
	return (
		<Select
			ref={ref}
			wait={wait}
			ScrollableContainer={ScrollableContainer}
			getScrollableContainerHeight={getScrollableContainerHeight}
			getScrollableContainerScrollY={getScrollableContainerScrollY}
			setScrollableContainerScrollY={setScrollableContainerScrollY}
			{...rest}
		/>
	)
})

SelectComponent.propTypes = {
	wait: PropTypes.bool
}

export default SelectComponent