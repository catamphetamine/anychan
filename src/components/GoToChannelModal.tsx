import type { ChannelId } from '@/types'

import React, { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-pages'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

// @ts-expect-error
import { Modal } from 'react-responsive-ui'

import Button from 'frontend-lib/components/Button.js'

import { Form, Field, Submit, FormComponent, FormAction, FormComponentAndButton } from './Form.js'
import FillButton from './FillButton.js'
import ChannelUrl from './ChannelUrl.js'

import useMessages from '../hooks/useMessages.js'
import useLoadChannelPage from '../hooks/useLoadChannelPage.js'

import { setShowPageLoadingIndicator } from '../redux/app.js'

import useSelector from '../hooks/useSelector.js'

import RightArrow from 'frontend-lib/icons/right-arrow-minimal.svg'
import CloseIcon from 'frontend-lib/icons/close.svg'

import './GoToChannelModal.css'

const CHANNEL_ID_REG_EXP = /^[a-z0-9\-_]+$/i

export default function GoToChannelModal({
	isOpen,
	close
}: GoToChannelModalProps) {
	const messages = useMessages()
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const [isSubmitting, setSubmitting] = useState(false)
	const [channelNotFoundError, setChannelNotFoundError] = useState(false)

	const loadChannelPage = useLoadChannelPage()

	const availableChannels = useSelector(state => state.channels.channels)

	const onGoToChannel = useCallback(async ({ channelId }: { channelId: ChannelId }) => {
		try {
			channelId = channelId.toString()
			setChannelNotFoundError(false)
			setSubmitting(true)
			dispatch(setShowPageLoadingIndicator(true))
			await loadChannelPage({
				channel: availableChannels.find(_ => _.id === channelId),
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
		availableChannels,
		loadChannelPage,
		close,
		setSubmitting,
		setChannelNotFoundError,
		navigate,
		dispatch
	])

	const channelOptions = useMemo(() => {
		if (availableChannels) {
			return availableChannels.map((channel) => ({
				value: channel.id,
				label: channel.title
			}))
		}
		return []
	}, [availableChannels])

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