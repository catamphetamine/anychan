import type { DataSource } from '@/types'

import React from 'react'
import PropTypes from 'prop-types'

import { dataSource as dataSourceType } from '../PropTypes.js'

export default function DataSourceIcon({
	dataSource,
	className
}: DataSourceIconProps) {
	return (
		<img src={dataSource.icon} className={className}/>
	)
}

DataSourceIcon.propTypes = {
	dataSource: dataSourceType.isRequired,
	className: PropTypes.string
}

type DataSourceIconProps = {
	dataSource: DataSource,
  className?: string
}