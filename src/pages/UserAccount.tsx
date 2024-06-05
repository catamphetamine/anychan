import React, { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'

import useDataSource from '../hooks/useDataSource.js'
import useUserData from '../hooks/useUserData.js'
import useSettings from '../hooks/useSettings.js'
import useMessages from '../hooks/useMessages.js'

import FillButton from '../components/FillButton.js'
import { Form, Field, Submit, FormComponentsAndButton, FormComponent, FormAction } from '../components/Form.js'
import Heading from '../components/Heading.js'

import logIn from '../api/logIn.js'
import logOut from '../api/logOut.js'

import {
	NotFoundError,
	RateLimitError,
	InvalidAuthToken,
	AuthTokenNotFoundOrIncorrectSecret
} from "@/api/errors"

import { useSelector } from '@/hooks'

import { showError } from '../redux/notifications.js'
import { setLoggedIn, setLoggedOut } from '../redux/auth.js'

import setInitialAuthState  from '../utility/auth/setInitialAuthState.js'

import {
	ContentSections,
	ContentSection,
	ContentSectionHeader
} from 'frontend-lib/components/ContentSection.js'

import './UserAccount.css'

export default function UserAccountPage() {
	const messages = useMessages()

	const accessToken = useSelector(state => state.auth.accessToken)

	return (
		<section className="UserAccount Content Content--text">
			<Heading onBackground>
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
	const userData = useUserData()
	const dispatch = useDispatch()
	const messages = useMessages()

	const onLogOut = useCallback(async () => {
		await logOut({
			dataSource,
			userSettings
		})
		dispatch(setLoggedOut())
		// Clear auth token from `userData`.
		userData.removeAuth()
		// See if the server has correctly cleared the access token cookie.
		// If the cookie wasn't cleared properly,
		// read the existing access token from such cookie
		// to indicate to the user that the logout didn't happen.
		setInitialAuthState({ dispatch, dataSource, userData })
	}, [
		dataSource,
		userSettings,
		userData,
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
	const userData = useUserData()
	const messages = useMessages()
	const dispatch = useDispatch()

	const [logInError, setLogInError] = useState<string>()

	const onInputValueChange = useCallback(() => {
		setLogInError(undefined)
	}, [])

	const onSubmit = useCallback(async ({
		token,
		tokenPassword
	}: {
		token: string,
		tokenPassword?: string
	}) => {
		try {
			setLogInError(undefined)
			const result = await logIn({
				token,
				tokenPassword,
				dataSource,
				userSettings
			})
			dispatch(setLoggedIn(result))
			console.log('@@@ Log In result:', result)
			if (!result.accessToken) {
				dispatch(showError('Access token not found in server response'))
				return
			}
			userData.setAuth({
				accessToken: result.accessToken
			})
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
		userSettings,
		userData
	])

	return (
		<ContentSections>
			{dataSource.id === '4chan' && (
				<ContentSection className="UserAccount-4chanPassNote">
					<p style={{ marginTop: 0 }}>
						Support for 4chan passes hasn't been implemented due to the fact that the developer doesn't have a 4chan pass. Otherwise, the implementation would be quite simple.
						<br/>
						If you think you could provide one for testing purposes, consider mailing it to <a href="mailto:anychan.official@gmail.com">anychan.official@gmail.com</a>.
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
						<FormComponentsAndButton
							smallScreen={dataSource.supportsFeature('logIn.tokenPassword') ? false : undefined}
							ratio={dataSource.supportsFeature('logIn.tokenPassword') ? '2:1:x' : undefined}
							count={dataSource.supportsFeature('logIn.tokenPassword') ? 2 : 1}>
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
							{dataSource.supportsFeature('logIn.tokenPassword') &&
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