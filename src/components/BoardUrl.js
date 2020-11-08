import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './BoardUrl.css'

export default function BoardUrl({
	boardId,
	selected,
	hovered,
	active,
	className,
	...rest
}) {
	// Using `<span/>` instead of `<div/>`
	// because a `<button/>` can't contain a `<div/>`
	// and `<BoardUrl/>` is used in `optionComponent` of `<Autocomplete/>`.
	return (
		<span
			{...rest}
			className={classNames(className, 'BoardUrl', {
				'BoardUrl--selected': selected,
				'BoardUrl--hovered': hovered,
				'BoardUrl--active': active
			})}>
			{boardId}
		</span>
	)
}

BoardUrl.propTypes = {
	boardId: PropTypes.string.isRequired,
	selected: PropTypes.bool,
	hovered: PropTypes.bool,
	active: PropTypes.bool,
	className: PropTypes.string
}