import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './BoardUrl.css'

export default function BoardUrl({ boardId, className, ...rest }) {
	// Using `<span/>` instead of `<div/>`
	// because a `<button/>` can't contain a `<div/>`
	// and `<BoardUrl/>` is used in `optionComponent` of `<Autocomplete/>`.
	return (
		<span className={classNames('BoardUrl', className)} {...rest}>
			{boardId}
		</span>
	)
}

BoardUrl.propTypes = {
	boardId: PropTypes.string.isRequired,
	className: PropTypes.string
}