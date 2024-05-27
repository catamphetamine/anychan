import type { Locale } from '@/types'
import type { Content as ContentType } from 'social-components'

import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'

// @ts-expect-error
import { Modal, Checkbox, TextInput } from 'react-responsive-ui'

import {
	ContentSection,
	ContentSectionHeader
} from 'frontend-lib/components/ContentSection.js'

import TextButton from '../TextButton.js'
import { FormComponent, FormLabel } from '../Form.js'

import { compileWordPatterns } from 'social-components/text'
import { censorWords } from 'social-components/content'

// @ts-ignore
import { Content } from 'social-components-react/components/PostContent.js'

import useEffectSkipMount from 'frontend-lib/hooks/useEffectSkipMount.js'

import getCensoredWordsByLanguage from '../../utility/getCensoredWordsByLanguage.js'

import useMessages from '../../hooks/useMessages.js'

import './CensoredWordsSettings.css'

export default function CensoredWordsSettings({
	language
}: CensoredWordsSettingsProps) {
	const messages = useMessages()

	const [showCensoredWords, setShowCensoredWords] = useState(false)
	const [showTestWordCensorshipRulesModal, setShowTestWordCensorshipRulesModal] = useState(false)

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
	language: PropTypes.string.isRequired
}

interface CensoredWordsSettingsProps {
	language: Locale
}

function TestCensoredWords({
	language
}: TestCensoredWordsProps) {
	const messages = useMessages()

	const [useCustomRule, setUseCustomRule] = useState(false)
	const [rule, setRule] = useState<string>()
	const [text, setText] = useState<string>()
	const [result, setResult] = useState<ContentType>()

	const ruleInputRef = useRef<HTMLInputElement>()

	function updateResult(text = '', useCustomRule = false, rule = '') {
		const patterns = useCustomRule
			? [rule]
			: getCensoredWordsByLanguage(language)
		// New line characters are ignored.
		setResult([censorWords(text, compileWordPatterns(patterns, language))])
	}

	function onUseCustomRuleChange(value: boolean) {
		setUseCustomRule(value)
		updateResult(text, value, rule)
	}

	function onRuleChange(value: string) {
		setRule(value)
		updateResult(text, useCustomRule, value)
	}

	function onTextChange(value: string) {
		setText(value)
		updateResult(value, useCustomRule, rule)
	}

	useEffectSkipMount(() => {
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
	language: PropTypes.string.isRequired
}

interface TestCensoredWordsProps {
	language: Locale
}