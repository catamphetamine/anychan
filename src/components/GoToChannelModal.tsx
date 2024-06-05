import type { Channel, ChannelId } from '@/types'

import React, { useCallback, useState, useRef } from 'react'
import { useNavigate } from 'react-pages'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

// @ts-expect-error
import { Modal } from 'react-responsive-ui'

import Button from 'frontend-lib/components/Button.js'

import { Form, Field, Submit, FormComponent, FormAction, FormComponentAndButton } from './Form.js'
import FillButton from './FillButton.js'
import ChannelUrl from './ChannelUrl.js'

import {
	useOriginalDomain,
	useMessages,
	useLoadChannelPage,
	useSelector,
	useSettings,
	useDataSource,
	useMultiDataSource,
	useLocale
} from '@/hooks'

import { setShowPageLoadingIndicator } from '../redux/app.js'

import findChannelsCached from '@/api/cached/findChannels.js'

import RightArrow from 'frontend-lib/icons/right-arrow-minimal.svg'
import CloseIcon from 'frontend-lib/icons/close.svg'

import './GoToChannelModal.css'

const CHANNEL_ID_REG_EXP = /^[a-z0-9\-_]+$/i

export default function GoToChannelModal({
	isOpen,
	close
}: GoToChannelModalProps) {
	const locale = useLocale()
	const messages = useMessages()
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const userSettings = useSettings()
	const dataSource = useDataSource()
	const originalDomain = useOriginalDomain()
	const multiDataSource = useMultiDataSource()

	const [isSubmitting, setSubmitting] = useState(false)
	const [channelNotFoundError, setChannelNotFoundError] = useState(false)

	const channelsCache = useRef<Record<ChannelId, Channel>>({})

	const loadChannelPage = useLoadChannelPage()

	const onGoToChannel = useCallback(async ({ channelId }: { channelId: ChannelId }) => {
		try {
			channelId = channelId.toString()
			setChannelNotFoundError(false)
			setSubmitting(true)
			dispatch(setShowPageLoadingIndicator(true))
			await loadChannelPage({
				channel: channelsCache.current[channelId],
				channelId
			})
			close()
			navigate(`/${channelId}`, { load: false })
		} catch (error) {
			if (error.status === 404) {
				setChannelNotFoundError(true)
			} else {
				throw error
			}
		} finally {
			setSubmitting(false)
			dispatch(setShowPageLoadingIndicator(false))
		}
	}, [
		channelsCache,
		loadChannelPage,
		close,
		setSubmitting,
		setChannelNotFoundError,
		navigate,
		dispatch
	])

	const getChannelOptions = useCallback(async (query: string) => {
		const { channels } = await findChannelsCached({
			search: query,
			userSettings,
			dataSource,
			multiDataSource,
			originalDomain,
			locale
		})

		// Cache the fetched channels so that later, in case the user submits the form,
		// there'd be no need to re-fetch the selected channel.
		for (const channel of channels) {
			channelsCache.current[channel.id] = channel
		}

		// Return a list of options.
		return channels.map((channel) => ({
			value: channel.id,
			label: channel.title
		}))
	}, [
		channelsCache,
		userSettings,
		dataSource,
		multiDataSource,
		originalDomain,
		locale
	])

	const validateChannelId = useCallback((value: string) => {
		if (!CHANNEL_ID_REG_EXP.test(value)) {
			return messages.invalidBoardId
		}
	}, [messages])

	const onInputValueChange = useCallback(() => {
		setChannelNotFoundError(false)
	}, [])

	return (
		<Modal
			isOpen={isOpen}
			close={close}
			className="GoToChannelModal"
			wait={isSubmitting}>
			<Modal.Content>
				<Form
					autoFocus
					onSubmit={onGoToChannel}>
					<FormComponentAndButton>
						<FormComponent>
							<Field
								required
								type="autocomplete"
								inputType="search"
								acceptsAnyValue
								submitOnSelectOption
								getOption={getEmptyOption}
								getOptions={getChannelOptions}
								optionComponent={ChannelOption}
								name="channelId"
								autoComplete="off"
								placeholder={messages.board}
								validate={validateChannelId}
								error={channelNotFoundError ? messages.boardNotFound : undefined}
								onInputValueChange={onInputValueChange}
							/>
						</FormComponent>
						<FormAction inline>
							<Submit
								aria-label={messages.actions.submit}
								component={FillButton}>
								<RightArrow className="GoToChannelModal-goButtonIcon"/>
							</Submit>
						</FormAction>
					</FormComponentAndButton>
				</Form>
				<Button
					title={messages.actions.close}
					onClick={close}
					className="GoToChannelModal-close">
					<CloseIcon className="GoToChannelModal-closeIcon"/>
				</Button>
			</Modal.Content>
		</Modal>
	)
}

GoToChannelModal.propTypes = {
	isOpen: PropTypes.bool,
	close: PropTypes.func.isRequired
}

interface GoToChannelModalProps {
	isOpen?: boolean,
	close: () => void
}

function ChannelOption({ value, label }: ChannelOptionProps) {
	return (
		<div className="GoToChannelModal-option">
			<div className="GoToChannelModal-optionValue">
				<ChannelUrl channelId={value}/>
			</div>
			{label && (
				<>
					<div className="GoToChannelModal-optionLabel">
						{label}
					</div>
				</>
			)}
		</div>
	)
}

interface ChannelOptionProps {
	value: string,
	label: string
}

async function getEmptyOption(): Promise<undefined> {
	return undefined
}