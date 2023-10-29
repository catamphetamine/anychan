import React, { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import useDataSource from '../hooks/useDataSource.js'
import useSettings from '../hooks/useSettings.js'
import useMessages from '../hooks/useMessages.js'

import FillButton from '../components/FillButton.js'
import { Form, Field, Submit, FormComponentsAndButton, FormComponent, FormAction } from '../components/Form.js'
import Heading from '../components/Heading.js'

import { user as userType } from '../PropTypes.js'

import NotFoundError from '../api/errors/NotFoundError.js'
import RateLimitError from '../api/errors/RateLimitError.js'
import InvalidAuthToken from '../api/errors/InvalidAuthToken.js'
import AuthTokenNotFoundOrIncorrectSecret from '../api/errors/AuthTokenNotFoundOrIncorrectSecret.js'

import { notify, showError } from '../redux/notifications.js'
import { logIn, logOut } from '../redux/auth.js'

import updateAuthTokenFromCookie  from '../utility/auth/updateAuthTokenFromCookie.js'

import {
	ContentSections,
	ContentSection,
	ContentSectionHeader
} from 'frontend-lib/components/ContentSection.js'

import './UserAccount.css'

export default function UserAccountPage() {
	const dataSource = useDataSource()
	const messages = useMessages()

	const accessToken = useSelector(state => state.auth.accessToken)

	return (
		<section className="UserAccount Content Content--text">
			<Heading>
				{messages.userAccount.title}
			</Heading>
			{accessToken &&
				<Authenticated/>
			}
			{!accessToken &&
				<NotAuthenticated/>
			}
		</section>
	)
}

function Authenticated() {
	const dataSource = useDataSource()
	const userSettings = useSettings()
	const dispatch = useDispatch()
	const messages = useMessages()

	const onLogOut = useCallback(async () => {
		await dispatch(logOut({
			dataSource,
			userSettings,
			messages
		}))
		// Clear the cookie just in case the server didn't do that.
		if (dataSource.clearAuthCookies) {
			dataSource.clearAuthCookies()
		}
		// See if the server has correctly cleared the access token cookie.
		// If the cookie wasn't cleared properly,
		// read the existing access token from such cookie
		// to indicate to the user that the logout didn't happen.
		updateAuthTokenFromCookie({ dispatch, dataSource })
	}, [
		dataSource,
		userSettings,
		messages
	])

	return (
		<ContentSections>
			<ContentSection>
				<Form onSubmit={onLogOut}>
					<FormAction top>
						<Submit component={FillButton} className="UserAccount-logOutButton">
							{messages.logOut}
						</Submit>
					</FormAction>
				</Form>
			</ContentSection>
		</ContentSections>
	)
}

function NotAuthenticated() {
	const dataSource = useDataSource()
	const userSettings = useSettings()
	const messages = useMessages()
	const dispatch = useDispatch()

	const [logInError, setLogInError] = useState()

	const onInputValueChange = useCallback(() => {
		setLogInError()
	}, [])

	const onSubmit = useCallback(async ({ token, tokenPassword }) => {
		try {
			setLogInError()
			const result = await dispatch(logIn({
				token,
				tokenPassword,
				dataSource,
				userSettings,
				messages
			}))
			console.log('@@@ Log In result:', result)
			if (!result.accessToken) {
				dispatch(showError('Access token not found in server response'))
				return
			}
		} catch (error) {
			if (error instanceof NotFoundError) {
				setLogInError(messages.userAccount.notFoundError)
			} else if (error instanceof RateLimitError) {
				setLogInError(messages.userAccount.notFoundError)
			} else if (error instanceof InvalidAuthToken) {
				setLogInError(messages.userAccount.invalidPass)
			} else if (error instanceof AuthTokenNotFoundOrIncorrectSecret) {
				setLogInError(messages.userAccount.passNotFoundOrIncorrectPin)
			} else {
				setLogInError(messages.userAccount.logInError)
			}
		}
	}, [
		messages,
		dataSource,
		userSettings
	])

	return (
		<ContentSections>
			{dataSource.id === '4chan' && (
				<ContentSection className="UserAccount-4chanPassNote">
					<p style={{ marginTop: 0 }}>
						Support for 4chan passes hasn't been implemented due to the fact that the developer doesn't have a 4chan pass.
						<br/>
						If you have one, consider mailing it to <a href="mailto:anychan.official@gmail.com">anychan.official@gmail.com</a>.
					</p>
				</ContentSection>
			)}
			{!dataSource.supportsLogIn() && (
				<ContentSection className="UserAccount-logInNotSupported">
					{messages.userAccount.notSupported}
				</ContentSection>
			)}
			{dataSource.supportsLogIn() && (
				<ContentSection>
					<Form onSubmit={onSubmit}>
						<FormComponentsAndButton
							smallScreen={dataSource.hasLogInTokenPassword() ? false : undefined}
							ratio={dataSource.hasLogInTokenPassword() ? '2:1:x' : undefined}
							count={dataSource.hasLogInTokenPassword() ? 2 : 1}>
							<FormComponent>
								<Field
									required
									type="text"
									inputType="password"
									name="token"
									label={messages.userAccount.pass}
									error={logInError}
									onChange={onInputValueChange}
								/>
							</FormComponent>
							{dataSource.hasLogInTokenPassword() &&
								<FormComponent>
									<Field
										required
										type="text"
										inputType="password"
										name="tokenPassword"
										label={messages.userAccount.passPin}
										onChange={onInputValueChange}
									/>
								</FormComponent>
							}
							<FormAction inline>
								<Submit component={FillButton}>
									{messages.logIn}
								</Submit>
							</FormAction>
						</FormComponentsAndButton>
					</Form>
				</ContentSection>
			)}
		</ContentSections>
	)
}