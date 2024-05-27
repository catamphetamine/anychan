import type { InferProps } from 'prop-types'

import React from 'react'

// @ts-expect-error
import { Select } from 'react-responsive-ui'

import ScrollableContainer from './ScrollableContainer.js'

const SelectComponent = React.forwardRef<HTMLButtonElement, InferProps<typeof Select.propTypes>>((props, ref) => {
	return (
		<Select
			ref={ref}
			{...props}
			ScrollableContainer={ScrollableContainer}
		/>
	)
})

export default SelectComponent