import React from 'react'

import ApplicationMenu from './ApplicationMenu'

import './Footer.css'

export default function Footer() {
	return (
		<footer className="webpage__footer">
			<div className="webpage__footer-copyright">
				<a
					target="_blank"
					href="https://github.com/catamphetamine/chanchan"
					className="webpage__footer-link">
					chanchan imageboard browser
				</a>
				{' '}
				ver. 0.0.1
			</div>
			<ApplicationMenu/>
		</footer>
	)
}