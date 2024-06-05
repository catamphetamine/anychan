import React from 'react'
import PropTypes from 'prop-types'

// @ts-expect-error
import { Autocomplete } from 'react-responsive-ui'

import ScrollableContainer, {
	getScrollableContainerHeight,
	getScrollableContainerScrollY,
	setScrollableContainerScrollY
} from '../../ScrollableContainer.js'

const AutocompleteComponent = React.forwardRef<HTMLInputElement, AutocompleteComponentProps>(({
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

interface AutocompleteComponentProps {
	wait?: boolean
}

export default AutocompleteComponent