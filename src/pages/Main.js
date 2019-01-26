import React from 'react'
import { meta } from 'react-website'
import { connect } from 'react-redux'

import Boards from '../components/Boards'

import {
	ContentSection
} from 'webapp-frontend/src/components/ContentSection'

import './Main.css'

export default class MainPage extends React.Component {
	render() {
		return (
			<section className="container">
				<div className="row">
					<div className="col-3 col-xs-12">
						<ContentSection>
							<Boards/>
						</ContentSection>
					</div>
					<div className="col-9 col-xs-12">
					</div>
				</div>
			</section>
		)
	}
}

