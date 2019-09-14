import {
	quote,
	link
} from './parseCommentContentPlugins'

import {
	code,
	codeBlock
} from './parseCommentContentPlugins.lainchan'

export const bold = {
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

export const italic = {
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

export const underline = {
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

const strikethrough = {
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

const heading = {
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

const spoiler = {
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
	bold,
	italic,
	underline,
	strikethrough,
	heading,
	spoiler,
	quote,
	link,
	code,
	codeBlock
]