import React, { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { goto } from 'react-pages'

import { Modal } from 'react-responsive-ui'
import Button from 'frontend-lib/components/Button.js'

import { Form, Field, Submit, FormComponent, FormAction, FormComponentAndButton } from './Form.js'
import FillButton from './FillButton.js'
import ChannelUrl from './ChannelUrl.js'

import useMessages from '../hooks/useMessages.js'
import useLoadChannelPage from '../hooks/useLoadChannelPage.js'

import { setShowPageLoadingIndicator } from '../redux/app.js'

import RightArrow from 'frontend-lib/icons/right-arrow-minimal.svg'
import CloseIcon from 'frontend-lib/icons/close.svg'

import './GoToChannelModal.css'

const CHANNEL_ID_REG_EXP = /^[a-z0-9\-_]+$/i

export default function GoToChannelModal({
	isOpen,
	close
}) {
	const messages = useMessages()
	const dispatch = useDispatch()

	const [isSubmitting, setSubmitting] = useState(false)
	const [channelNotFoundError, setChannelNotFoundError] = useState(false)

	const loadChannelPage = useLoadChannelPage()

	const onGoToChannel = useCallback(async ({ channelId }) => {
		try {
			channelId = channelId.toString()
			setChannelNotFoundError(false)
			setSubmitting(true)
			dispatch(setShowPageLoadingIndicator(true))
			await loadChannelPage({
				channelId
			})
			close()
			dispatch(goto(`/${channelId}`, { load: false }))
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
		loadChannelPage,
		close,
		setSubmitting,
		setChannelNotFoundError,
		dispatch
	])

	const availableChannels = useSelector(state => state.data.channels)

	const channelOptions = useMemo(() => {
		if (availableChannels) {
			return availableChannels.map((channel) => ({
				value: channel.id,
				label: channel.title
			}))
		}
		return []
	}, [availableChannels])

	const validateChannelId = useCallback((value) => {
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
								options={channelOptions}
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
								aria-label={messages.actions.ok}
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

function ChannelOption({ value, label }) {
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