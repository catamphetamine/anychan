import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import AnonymousIcon from 'webapp-frontend/assets/images/icons/anonymous.svg'

import './CountryFlag.css'

export default function CountryFlag({ country, name, flagsPath, className }) {
	if (country === 'ZZ') {
		return (
			<AnonymousIcon
				title={name}
				className={classNames('country-flag--anonymous', className)}/>
		)
	}
	// Screen readers will pronounce `alt` but will skip `title` on images.
	return (
		<img
			alt={name}
			title={name}
			className={classNames('country-flag', className)}
			src={`${flagsPath}${getCountryCodeForFlag(country).toLowerCase()}.svg`}/>
	)
}

CountryFlag.propTypes = {
	country: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	flagsPath: PropTypes.string.isRequired,
	className: PropTypes.string
}

CountryFlag.defaultProps = {
	flagsPath: 'https://lipis.github.io/flag-icon-css/flags/4x3/'
}

function getCountryCodeForFlag(country) {
	switch (country) {
		// "Ascension Island".
		// The flag is missing for it:
		// https://lipis.github.io/flag-icon-css/flags/4x3/ac.svg
		// GitHub issue:
		// https://github.com/lipis/flag-icon-css/issues/537
		// Using "SH" flag as a temporary substitute
		// because previously "AC" and "TA" were parts of "SH".
		case 'AC':
			return 'SH'

		// "Tristan da Cunha".
		// The flag is missing for it:
		// https://lipis.github.io/flag-icon-css/flags/4x3/ta.svg
		// GitHub issue:
		// https://github.com/lipis/flag-icon-css/issues/537
		// Using "SH" flag as a temporary substitute
		// because previously "AC" and "TA" were parts of "SH".
		case 'TA':
			return 'SH'

		default:
			return country
	}
}