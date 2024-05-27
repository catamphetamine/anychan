import type { Props } from '@/types'

import React from 'react'

import ButtonStyled from './ButtonStyled.js'

const FillButton = React.forwardRef<HTMLButtonElement, FillButtonProps>((props, ref) => {
	return (
		<ButtonStyled
			{...props}
			ref={ref}
			style="fill"
		/>
	)
})

type FillButtonProps = Props<typeof ButtonStyled>

export default FillButton