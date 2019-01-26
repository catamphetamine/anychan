import React from 'react'
import { MenuIcon } from 'react-responsive-ui'
import { Link } from 'react-website'

import ApplicationMenu from './ApplicationMenu'

// import HomeIcon  from '../../assets/images/home.svg'
// import UsersIcon from '../../assets/images/users.svg'

import './Header.css'

export default function Header() {
	return (
		<nav className="webpage__header">
			<div className="container">
				<div className="webpage__header__row">
					{/*<Menu>
						<MenuLink to="/" exact>
							<HomeIcon className="menu-item__icon menu-item__icon--home"/>
							Home
						</MenuLink>
						<MenuLink to="/users">
							<UsersIcon className="menu-item__icon menu-item__icon--users"/>
							Users
						</MenuLink>
					</Menu>*/}

					<Link to="/" className="header__link">
						<MenuIcon className="menu-button"/>
					</Link>

					<ApplicationMenu/>
				</div>
			</div>
		</nav>
	)
}