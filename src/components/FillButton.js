import React from 'react'

import ButtonStyled from './ButtonStyled.js'

let FillButton = (props, ref) => {
	return (
		<ButtonStyled
			{...props}
			ref={ref}
			style="fill"
		/>
	)
}

FillButton = React.forwardRef(FillButton)

export default FillButton