import React, { ReactNode } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './Table.css'

export default function Table({
	headers,
	rows,
	className,
	...rest
}: TableProps) {
	return (
		<table className={classNames('Table', className)} {...rest}>
			<thead>
				<tr>
					{headers.map((header, i) => (
						<th key={i}>
							{header}
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{rows.map((row, i) => (
					<tr key={i}>
						{row.map((value, i) => (
							<td key={i}>
								{value}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	)
}

Table.propTypes = {
	headers: PropTypes.arrayOf(PropTypes.string).isRequired,
	rows: PropTypes.arrayOf(
		PropTypes.arrayOf(PropTypes.any)
	).isRequired,
	className: PropTypes.string
}

interface TableProps {
	headers: string[],
	rows: ReactNode[][],
	className?: string
}