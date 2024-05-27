import type { Content as ContentType } from 'social-components'

import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

// @ts-ignore
import { Content } from 'social-components-react/components/PostContent.js'

import { postContent } from 'social-components-react/components/PropTypes.js'

import './Markup.css'

export default function Markup({
	id,
	markup,
	content,
	fullWidth,
	className
}: MarkupProps) {
	const dangerouslySetInnerHTML = useMemo(() => ({
		__html: markup
	}), [markup])

	const element = (
		<div
			id={id}
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
	id: PropTypes.string,
	markup: PropTypes.string,
	content: postContent,
	fullWidth: PropTypes.bool,
	className: PropTypes.string
}

interface MarkupProps {
	id?: string,
	markup?: string,
	content?: ContentType,
	fullWidth?: boolean,
	className?: string
}