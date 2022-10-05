import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { Content } from 'social-components-react/components/PostContent.js'
import { postContent } from 'social-components-react/components/PropTypes.js'

import './Markup.css'

export default function Markup({
	content,
	markup,
	fullWidth,
	className
}) {
	const dangerouslySetInnerHTML = useMemo(() => ({
		__html: markup
	}), [markup])
	const banner = (
		<div
			dangerouslySetInnerHTML={markup ? dangerouslySetInnerHTML : undefined}
			className={classNames('Markup', className)}>
			{content &&
				<Content>
					{content}
				</Content>
			}
		</div>
	)
	if (fullWidth) {
		return (
			<div className="Webpage-element--fullWidth">
				{element}
			</div>
		)
	}
	return element
}

Markup.propTypes = {
	content: postContent,
	markup: PropTypes.string,
	fullWidth: PropTypes.bool,
	className: PropTypes.string
}