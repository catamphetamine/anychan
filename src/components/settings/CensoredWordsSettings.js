import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Modal, Checkbox, TextInput } from 'react-responsive-ui'

import {
	ContentSection,
	ContentSectionHeader
} from 'frontend-lib/components/ContentSection.js'

import TextButton from '../TextButton.js'
import { FormComponent, FormLabel } from '../Form.js'

import censorWords from 'social-components/utility/post/censorWords.js'
import compileWordPatterns from 'social-components/utility/post/compileWordPatterns.js'

import { Content } from 'social-components-react/components/PostContent.js'

import getCensoredWordsByLanguage from '../../utility/getCensoredWordsByLanguage.js'

import './CensoredWordsSettings.css'

export default function CensoredWordsSettings({
	messages,
	language
}) {
	const [showCensoredWords, setShowCensoredWords] = useState()
	const [showTestWordCensorshipRulesModal, setShowTestWordCensorshipRulesModal] = useState()
	return (
		<ContentSection>
			<ContentSectionHeader lite>
				{messages.settings.censorship.title}
			</ContentSectionHeader>
			{/* Censored Words syntax summary. */}
			<div className="CensoredWordsFilters-docs">
				{messages.settings.censorship.docs.titleStart}
				<a
					target="_blank"
					href="https://www.regexpal.com/"
					className="CensoredWordsFilters-practiceLink">
					{messages.settings.censorship.docs.titleRegExps}
				</a>
				{messages.settings.censorship.docs.titleEnd}:
				<ul className="CensoredWordsFilters-tips">
					<li>
						<code>^</code> — {messages.settings.censorship.docs.tips.start}.
					</li>
					<li>
						<code>$</code> — {messages.settings.censorship.docs.tips.end}.
					</li>
					<li>
						<code>.</code> — {messages.settings.censorship.docs.tips.any}.
					</li>
					<li>
						<code>[abc]</code> — {messages.settings.censorship.docs.tips.anyOf}: <code>a</code>, <code>b</code>, <code>c</code>.
					</li>
					<li>
						<code>a?</code> — {messages.settings.censorship.docs.tips.optional} <code>a</code>.
					</li>
					<li>
						<code>.*</code> — {messages.settings.censorship.docs.tips.anyCountOf}.
					</li>
					<li>
						<code>.+</code> — {messages.settings.censorship.docs.tips.oneOrMoreOf}.
					</li>
					<li>
						<code>{'.{0,2}'}</code> — {messages.settings.censorship.docs.tips.rangeCountOf}.
					</li>
				</ul>
			</div>
			{/* "Hide Censored Words" button. */}
			{showCensoredWords &&
				<FormComponent type="button">
					<TextButton
						onClick={() => setShowCensoredWords(false)}>
						{messages.settings.censorship.hideCensoredWordsList}
					</TextButton>
				</FormComponent>
			}
			{/* Censored words list. */}
			{showCensoredWords &&
				<pre className="CensoredWordsFilters-list">
					{getCensoredWordsByLanguage(language).join('\n')}
				</pre>
			}
			{/* "Show Censored Words" button. */}
			{!showCensoredWords &&
				<FormComponent type="button">
					<TextButton
						onClick={() => setShowCensoredWords(true)}>
						{messages.settings.censorship.showCensoredWordsList}
					</TextButton>
				</FormComponent>
			}
			{/* "Test Censored Word Rules" button. */}
			<FormComponent type="button">
				<TextButton
					onClick={() => setShowTestWordCensorshipRulesModal(true)}>
					{messages.settings.censorship.test.title}
				</TextButton>
			</FormComponent>
			{/* "Test Censored Word Rules" modal. */}
			<Modal
				isOpen={showTestWordCensorshipRulesModal}
				close={() => setShowTestWordCensorshipRulesModal(false)}>
				<Modal.Title>
					{messages.settings.censorship.test.title}
				</Modal.Title>
				<Modal.Content>
					<TestCensoredWords
						messages={messages}
						language={language}/>
				</Modal.Content>
				<Modal.Actions>
					<TextButton
						onClick={() => setShowTestWordCensorshipRulesModal(false)}>
						{messages.actions.close}
					</TextButton>
				</Modal.Actions>
			</Modal>
		</ContentSection>
	)
}

CensoredWordsSettings.propTypes = {
	messages: PropTypes.object.isRequired,
	language: PropTypes.string.isRequired
}

function TestCensoredWords({
	isOpen,
	close,
	messages,
	language
}) {
	const [useCustomRule, setUseCustomRule] = useState()
	const [rule, setRule] = useState()
	const [text, setText] = useState()
	const [result, setResult] = useState()
	const ruleInputRef = useRef()
	function updateResult(text = '', useCustomRule, rule = '') {
		const patterns = useCustomRule
			? [rule]
			: getCensoredWordsByLanguage(language)
		// New line characters are ignored.
		setResult([censorWords(text, compileWordPatterns(patterns, language))])
	}
	function onUseCustomRuleChange(value) {
		setUseCustomRule(value)
		updateResult(text, value, rule)
	}
	function onRuleChange(value) {
		setRule(value)
		updateResult(text, useCustomRule, value)
	}
	function onTextChange(value) {
		setText(value)
		updateResult(value, useCustomRule, rule)
	}
	useEffect(() => {
		if (useCustomRule) {
			ruleInputRef.current.focus()
		}
	}, [useCustomRule])
	return (
		<React.Fragment>
			<FormComponent>
				<Checkbox
					value={useCustomRule}
					onChange={onUseCustomRuleChange}>
					{messages.settings.censorship.test.useCustomRule}
				</Checkbox>
			</FormComponent>
			{useCustomRule &&
				<FormComponent>
					<TextInput
						ref={ruleInputRef}
						value={rule}
						onChange={onRuleChange}
						label={messages.settings.censorship.test.rule}
					/>
				</FormComponent>
			}
			<FormComponent>
				<TextInput
					multiline
					autoFocus
					value={text}
					onChange={onTextChange}
					label={messages.settings.censorship.test.text}
				/>
			</FormComponent>
			<FormComponent>
				<FormLabel>
					{messages.settings.censorship.test.result}
				</FormLabel>
				{result &&
					<Content>
						{result}
					</Content>
				}
			</FormComponent>
		</React.Fragment>
	)
}

TestCensoredWords.propTypes = {
	messages: PropTypes.object.isRequired,
	language: PropTypes.string.isRequired
}