import React from 'react'
import PropTypes from 'prop-types'

import { Select } from 'react-responsive-ui'

const SelectComponent = React.forwardRef(({
	wait,
	...rest
}, ref) => {
	return (
		<Select
			ref={ref}
			wait={wait}
			{...rest}
		/>
	)
})

SelectComponent.propTypes = {
	wait: PropTypes.bool
}

export default SelectComponent