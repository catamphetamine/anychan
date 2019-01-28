import React from 'react'
import { connect } from 'react-redux'

import Boards from '../components/Boards'

import { selectBoard, selectThread } from '../redux/chan'

import {
	ContentSection
} from 'webapp-frontend/src/components/ContentSection'

import './Home.css'

export default class HomePage extends React.Component {
	render() {
		return (
			<section className="container">
				<div className="row">
					<div className="col-3 col-xs-12">
						<ContentSection>
							<Boards/>
						</ContentSection>
					</div>
					<div className="col-9 col-xs-12 col--padding-left-xs">
					</div>
				</div>
			</section>
		)
	}
}

