import {
	parseQuote,
	parseLink
} from './parseCommentContentPlugins'

import {
	parseCode,
	parseCodeBlock
} from './parseCommentContentPlugins.lainchan'

export const parseBold = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'bold'
		}
	],
	createBlock(content) {
		return {
			type: 'text',
			style: 'bold',
			content
		}
	}
}

export const parseItalic = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'italic'
		}
	],
	createBlock(content) {
		return {
			type: 'text',
			style: 'italic',
			content
		}
	}
}

export const parseUnderline = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'underline'
		}
	],
	createBlock(content) {
		return {
			type: 'text',
			style: 'underline',
			content
		}
	}
}

const parseStrikethrough = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'strikethrough'
		}
	],
	createBlock(content) {
		return {
			type: 'text',
			style: 'strikethrough',
			content
		}
	}
}

const parseHeading = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'header'
		}
	],
	createBlock(content) {
		return {
			type: 'text',
			style: 'heading',
			content
		}
	}
}

const parseSpoiler = {
	tag: 'span',
	attributes: [
		{
			name: 'class',
			value: 'spoiler'
		}
	],
	createBlock(content) {
		return {
			type: 'spoiler',
			content
		}
	}
}

export default [
	parseBold,
	parseItalic,
	parseUnderline,
	parseStrikethrough,
	parseHeading,
	parseSpoiler,
	parseQuote,
	parseLink,
	parseCode,
	parseCodeBlock
]