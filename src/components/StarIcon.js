import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import StarFillIcon from 'webapp-frontend/assets/images/icons/menu/star-fill.svg'
import StarOutlineIcon from 'webapp-frontend/assets/images/icons/menu/star-outline.svg'

import './StarIcon.css'

export default function StarIcon({ className }) {
	// Using `<span/>` instead of `<div/>` here so that `<StarIcon/>`
	// could be used in `<BoardOrThreadMenu/>` inside a button.
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