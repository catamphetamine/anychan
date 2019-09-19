import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Button from 'webapp-frontend/src/components/Button'
import EllipsisIcon from 'webapp-frontend/assets/images/icons/ellipsis.svg'

import './SidebarSectionMoreButton.css'

export default function SidebarSectionMoreButton({ onClick }) {
	const [isPushed, setPushed] = useState()
	const onClick_ = useCallback(() => {
		const setPushedState = () => setPushed(!isPushed)
		const result = onClick(!isPushed)
		if (result && typeof result.then === 'function') {
			return result.then(setPushedState)
		} else {
			setPushedState()
		}
	}, [isPushed, onClick])
	return (
		<Button
			onClick={onClick_}
			className={classNames('sidebar-section-more-button', 'hover-button', 'rrui__button-reset', {
				'hover-button--pushed': isPushed
			})}>
			<EllipsisIcon className="sidebar-section-more-button__icon"/>
		</Button>
	)
}

SidebarSectionMoreButton.propTypes = {
	onClick: PropTypes.func.isRequired
}