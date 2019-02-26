import React from 'react'
import { Link } from 'react-website'

import { PostBlock } from 'webapp-frontend/src/components/Post'

import { getChan } from '../chan'

import './Home.css'

export default function Home() {
	const {
		color,
		website,
		logo: Logo,
		title,
		subtitle,
		description,
		announcement,
		links
	} = getChan()
	return (
		<section className="home-page">
			<div className="content content--posts">
				<div className="home-page__brand">
					{Logo &&
						<a
							target="_blank"
							href={website}>
							<Logo className="home-page__logo"/>
						</a>
					}
					<div className="home-page__title">
						<a
							target="_blank"
							href={website}
							style={{ color }}
							className="home-page__title-text">
							{title}
						</a>
						{subtitle &&
							<div className="home-page__subtitle">
								{subtitle}
							</div>
						}
					</div>
				</div>

				<p className="home-page__description">
					{description}
				</p>

				{announcement &&
					<div className="home-page__announcement">
						<PostBlock>
							{announcement}
						</PostBlock>
					</div>
				}

				{links &&
					<nav>
						<ul className="home-page__links">
							{links.map((link, i) => (
								<li key={i} className="home-page__link-item">
									<Link
										target="_blank"
										to={link.url}
										className="home-page__link">
										{link.text}
									</Link>
								</li>
							))}
						</ul>
					</nav>
				}
			</div>
		</section>
	)
}