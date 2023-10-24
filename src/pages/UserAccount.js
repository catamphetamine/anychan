import React, { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import useDataSource from '../hooks/useDataSource.js'
import useSettings from '../hooks/useSettings.js'
import useMessages from '../hooks/useMessages.js'

import FillButton from '../components/FillButton.js'
import { Form, Field, Submit, FormComponentAndButton, FormComponent, FormAction } from '../components/Form.js'
import Heading from '../components/Heading.js'

import { user as userType } from '../PropTypes.js'

import NotFoundError from '../api/errors/NotFoundError.js'
import RateLimitError from '../api/errors/RateLimitError.js'

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
		if (dataSource.clearAccessTokenCookie) {
			dataSource.clearAccessTokenCookie()
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

	const onSubmit = useCallback(async ({ token }) => {
		if (dataSource.id === '4chan') {
			dispatch(notify(messages.notImplemented))
			return
		}
		try {
			setLogInError()
			const result = await dispatch(logIn({
				token,
				dataSource,
				userSettings,
				messages
			}))
			console.log('@@@ Log In result:', result)
			if (dataSource.id === '2ch') {
				if (window.location.hostname === 'localhost') {
					dispatch(notify('Сервер `2ch.hk` проставляет куки, но куки не пишутся для сайтов, запущенных на localhost. Ваш пасскод, видимо, верный, но ответ сервера невозможно прочесть в случае с localhost. Но вы можете проставить куку "passcode_auth" вручную и обновить страницу.'))
					setTimeout(() => {
						dispatch(notify('Server-side-set cookies don\'t work on localhost. Your auth token looks valid but the response can\'t be read on localhost. But you could add "passcode_auth" cookie manually and refresh the page.'))
					}, 0)
					return
				}
			}
			if (!result.accessToken) {
				dispatch(showError('Access token not found in server response'))
				return
			}
		} catch (error) {
			if (error instanceof NotFoundError) {
				setLogInError(messages.userAccount.notFoundError)
			} else if (error instanceof RateLimitError) {
				setLogInError(messages.userAccount.rateLimitError)
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
			{!dataSource.api.logIn && (
				<ContentSection className="UserAccount-logInNotSupported">
					{messages.userAccount.notSupported}
				</ContentSection>
			)}
			{dataSource.api.logIn && (
				<ContentSection>
					<Form onSubmit={onSubmit}>
						<FormComponentAndButton>
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
							<FormAction inline>
								<Submit component={FillButton}>
									{messages.logIn}
								</Submit>
							</FormAction>
						</FormComponentAndButton>
					</Form>
				</ContentSection>
			)}
		</ContentSections>
	)
}