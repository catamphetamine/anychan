import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Button from 'webapp-frontend/src/components/Button'
import EllipsisIcon from 'webapp-frontend/assets/images/icons/ellipsis.svg'

import './SidebarSectionMoreButton.css'

export default function SidebarSectionMoreButton({ title, onClick }) {
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
			title={title}
			onClick={onClick_}
			aria-pressed={isPushed}
			className={classNames('SidebarSectionMoreButton', 'SidebarButton', 'rrui__button-reset', {
				'SidebarButton--pushed': isPushed,
				'SidebarButton--unpushed': !isPushed
			})}>
			<EllipsisIcon className="SidebarSectionMoreButton__Icon"/>
		</Button>
	)
}

SidebarSectionMoreButton.propTypes = {
	title: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired
}