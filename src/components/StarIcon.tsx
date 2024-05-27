import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import StarFillIcon from 'frontend-lib/icons/fill-and-outline/star-fill.svg'
import StarOutlineIcon from 'frontend-lib/icons/fill-and-outline/star-outline.svg'

import './StarIcon.css'

export default function StarIcon({ className }: StarIconProps) {
	// Using `<span/>` instead of `<div/>` here so that `<StarIcon/>`
	// could be used in `<Toolbar/>` inside a button.
	return (
		<span className={classNames(className, 'StarIcon')}>
			<StarFillIcon className="StarIconFill"/>
			<StarOutlineIcon className="StarIconOutline"/>
		</span>
	)
}

StarIcon.propTypes = {
	className: PropTypes.string
}

interface StarIconProps {
	className?: string
}