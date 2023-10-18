import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import useDataSource from '../hooks/useDataSource.js'
import useMessages from '../hooks/useMessages.js'

import FillButton from '../components/FillButton.js'
import { Form, Field, Submit, FormComponent, FormAction } from '../components/Form.js'
import Heading from '../components/Heading.js'

import { notify } from '../redux/notifications.js'

import {
	ContentSections,
	ContentSection,
	ContentSectionHeader
} from 'frontend-lib/components/ContentSection.js'

import './UserAccount.css'

export default function UserAccountPage() {
	const source = useDataSource()
	const messages = useMessages()
	const dispatch = useDispatch()

	const onSubmit = useCallback(async ({ token }) => {
		dispatch(notify(messages.notImplemented))
	}, [])

	return (
		<section className="UserAccount Content Content--text">
			<Heading>
				{messages.userAccount.title}
			</Heading>
			<ContentSections>
				{source.id === '4chan' && (
					<ContentSection className="UserAccount-4chanPassNote">
						<p style={{ marginTop: 0 }}>
							Support for 4chan passes hasn't been implemented due to the fact that the developer doesn't have a 4chan pass.
							<br/>
							If you have one, consider mailing it to <a href="mailto:anychan.official@gmail.com">anychan.official@gmail.com</a>.
						</p>
					</ContentSection>
				)}
				{!source.api.logIn && (
					<ContentSection className="UserAccount-logInNotSupported">
						{messages.userAccount.notSupported}
					</ContentSection>
				)}
				{source.api.logIn && (
					<ContentSection>
						<Form onSubmit={onSubmit}>
							<FormComponent>
								<Field
									required
									type="text"
									name="token"
									label={messages.userAccount.pass}
								/>
							</FormComponent>
							<FormAction>
								<Submit
									component={FillButton}
									title={messages.actions.post}>
									{messages.logIn}
								</Submit>
							</FormAction>
						</Form>
					</ContentSection>
				)}
			</ContentSections>
		</section>
	)
}