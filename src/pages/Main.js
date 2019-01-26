import React from 'react'
import { meta } from 'react-website'
import { connect } from 'react-redux'

import Boards from '../components/Boards'

import {
	ContentSection,
	ContentSectionHeader
} from 'webapp-frontend/src/components/ContentSection'

import './Main.css'

export default class MainPage extends React.Component {
	render() {
		return (
			<section className="container">
				<div className="row">
					<ContentSection className="col-3">
						<Boards/>
					</ContentSection>
					<div className="col-9">
					</div>
				</div>
			</section>
		)
	}
}

