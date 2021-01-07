import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Modal, Button, Checkbox, TextInput } from 'react-responsive-ui'

import {
	ContentSection,
	ContentSectionHeader
} from 'webapp-frontend/src/components/ContentSection'

import censorWords from 'social-components/commonjs/utility/post/censorWords'
import compileWordPatterns from 'social-components/commonjs/utility/post/compileWordPatterns'

import { Content } from 'webapp-frontend/src/components/PostContent'

import getCensoredWordsByLanguage from '../../utility/getCensoredWordsByLanguage'

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
				<div className="form__component form__component--button">
					<Button
						onClick={() => setShowCensoredWords(false)}
						className="rrui__button--text">
						{messages.settings.censorship.hideCensoredWordsList}
					</Button>
				</div>
			}
			{/* Censored words list. */}
			{showCensoredWords &&
				<pre className="CensoredWordsFilters-list">
					{getCensoredWordsByLanguage(language).join('\n')}
				</pre>
			}
			{/* "Show Censored Words" button. */}
			{!showCensoredWords &&
				<div className="form__component form__component--button">
					<Button
						onClick={() => setShowCensoredWords(true)}
						className="rrui__button--text">
						{messages.settings.censorship.showCensoredWordsList}
					</Button>
				</div>
			}
			{/* "Test Censored Word Rules" button. */}
			<div className="form__component form__component--button">
				<Button
					onClick={() => setShowTestWordCensorshipRulesModal(true)}
					className="rrui__button--text">
					{messages.settings.censorship.test.title}
				</Button>
			</div>
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
					<Button
						onClick={() => setShowTestWordCensorshipRulesModal(false)}
						className="rrui__button--text">
						{messages.actions.close}
					</Button>
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
			<Checkbox
				value={useCustomRule}
				onChange={onUseCustomRuleChange}
				className="form__component">
				{messages.settings.censorship.test.useCustomRule}
			</Checkbox>
			{useCustomRule &&
				<TextInput
					ref={ruleInputRef}
					value={rule}
					onChange={onRuleChange}
					label={messages.settings.censorship.test.rule}
					className="form__component"/>
			}
			<TextInput
				multiline
				autoFocus
				value={text}
				onChange={onTextChange}
				label={messages.settings.censorship.test.text}
				className="form__component"/>
			<div className="form__component">
				<div className="form__label">
					{messages.settings.censorship.test.result}
				</div>
				{result &&
					<Content>
						{result}
					</Content>
				}
			</div>
		</React.Fragment>
	)
}

TestCensoredWords.propTypes = {
	messages: PropTypes.object.isRequired,
	language: PropTypes.string.isRequired
}