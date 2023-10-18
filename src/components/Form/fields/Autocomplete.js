import React from 'react'
import PropTypes from 'prop-types'

import { Autocomplete } from 'react-responsive-ui'

import ScrollableContainer, {
	getScrollableContainerHeight,
	getScrollableContainerScrollY,
	setScrollableContainerScrollY
} from '../../ScrollableContainer.js'

const AutocompleteComponent = React.forwardRef(({
	wait,
	...rest
}, ref) => {
	return (
		<Autocomplete
			ref={ref}
			readOnly={wait}
			ScrollableContainer={ScrollableContainer}
			getScrollableContainerHeight={getScrollableContainerHeight}
			getScrollableContainerScrollY={getScrollableContainerScrollY}
			setScrollableContainerScrollY={setScrollableContainerScrollY}
			{...rest}
		/>
	)
})

AutocompleteComponent.propTypes = {
	wait: PropTypes.bool
}

export default AutocompleteComponent