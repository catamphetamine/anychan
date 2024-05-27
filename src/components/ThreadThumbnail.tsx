import type { Picture as PictureType } from 'social-components'

import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Picture from 'social-components-react/components/Picture.js'

import { picture } from 'social-components-react/components/PropTypes.js'

import './ThreadThumbnail.css'

export default function ThreadThumbnail({
	picture,
	spoiler,
	spoilerBlurRadius = 0.1,
	width,
	className
}: ThreadThumbnailProps) {
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
				picture={picture}
				width={width}
				height={width}
				fit="cover"
				blur={spoiler ? spoilerBlurRadius : undefined}
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
	spoiler: PropTypes.bool,
	spoilerBlurRadius: PropTypes.number,
	className: PropTypes.string
}

interface ThreadThumbnailProps {
	width: number,
	picture?: PictureType,
	spoiler?: boolean,
	spoilerBlurRadius?: number,
	className?: string
}