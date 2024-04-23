import * as React from 'react'
import * as PropTypes from 'prop-types'

import './OtherPage.css'

// import autoDarkMode from 'frontend-lib/utility/style/autoDarkMode.js'
// import applyDarkMode from 'frontend-lib/utility/style/applyDarkMode.js'
// autoDarkMode(settings.autoDarkMode, { setDarkMode: applyDarkMode })

export default function OtherPage({ children }: { children: React.ReactNode }) {
	return (
		<main className="OtherPage dark">
			<div className="OtherPage-content">
				{children}
			</div>
		</main>
	)
}

OtherPage.propTypes = {
	children: PropTypes.node
}