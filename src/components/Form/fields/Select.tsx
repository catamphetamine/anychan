import React from 'react'
import PropTypes from 'prop-types'

// @ts-expect-error
import { Select } from 'react-responsive-ui'

import ScrollableContainer, {
	getScrollableContainerHeight,
	getScrollableContainerScrollY,
	setScrollableContainerScrollY
} from '../../ScrollableContainer.js'

const SelectComponent = React.forwardRef<HTMLButtonElement, SelectComponentProps>(({
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

interface SelectComponentProps {
	wait?: boolean
}

export default SelectComponent