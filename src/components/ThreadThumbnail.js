import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Picture from 'social-components-react/components/Picture.js'

import { picture } from 'social-components-react/components/PropTypes.js'

import './ThreadThumbnail.css'

export default function ThreadThumbnail({
	picture,
	width,
	className
}) {
	const style = useMemo(() => ({
		width,
		height: width
	}), [
		width
	])

	if (picture) {
		return (
			<Picture
				border
				preload={false}
				picture={picture}
				width={width}
				height={width}
				fit="cover"
				blur={picture.spoiler ? 0.1 : undefined}
				className={classNames('ThreadThumbnail', className)}
			/>
		)
	}

	return (
		<div
 			style={style}
			className={classNames('ThreadThumbnail', className)}
		/>
	)
}

ThreadThumbnail.propTypes = {
	width: PropTypes.number.isRequired,
	picture: picture,
	className: PropTypes.string
}