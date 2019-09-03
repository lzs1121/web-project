import React from 'react';
export default function CareerCoachingCard(props) {
	const service = props.service;
	return (
		<div className='col-12 col-sm-4 text-center jr-card-wrapper'>
			<div className='card card-profile card-plain'>
				<div className='card-img-top'>
					<a href={'/career-coaching/' + service.slug}>
						<img className='lazyload' data-src={service.thumbnail === undefined ? '/images/courses/default.png' : service.thumbnail.secure_url} alt={service.name} />
					</a>
				</div>
				<div className='card-text-block'>
					<h6 className='card-category'>
						{service.slogan}
					</h6>
					<h2 className='card-title'>
						<a href={'/career-coaching/' + service.slug} target='_blank'>
							{service.chName}
						</a>
					</h2>
					<div className='card-footer'>
						<a className='btn btn-lg' href='/application'>参加报名</a>
						<a className='btn btn-lg' href={'/career-coaching/' + service.slug}>了解更多</a>
					</div>
				</div>
			</div>
		</div>
	);
}