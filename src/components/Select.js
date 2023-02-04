import React from 'react'
import { Select } from 'react-responsive-ui'

import ScrollableContainer from './ScrollableContainer.js'

const SelectComponent = React.forwardRef((props, ref) => {
	return (
		<Select
			ref={ref}
			{...props}
			ScrollableContainer={ScrollableContainer}
		/>
	)
})

export default SelectComponent