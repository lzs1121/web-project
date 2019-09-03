import React from 'react';
export default function TeacherCard(props) {
	const teacher = props.teacher;
	return (
		<div className='col-12 col-sm-4 teacher-card-wrapper'>
			<div className='card jr-instructors__card'>
				<div className='card-avatar'>
					<img className='lazyload' data-src={teacher.avatar.secure_url || ''} alt={teacher.name} />
				</div>
				<h5 className='jr-instructors__name'>{teacher.name}</h5>
				<p className='jr-instructors__title'> {teacher.title}</p>
				<p className='jr-instructors__title'>{teacher.company}</p>
				<p className='bio'>{teacher.introduction}</p>
				<div className='jr-instructors__card--tag'>
					<div className='tag-container'>
						{
							(teacher.displayCompany === true) ? (() => {
								return <ul className='jr-partners__list'>{teacher.preCompany.map(company => {
									return <li><img className='lazyload jr-partners__list--icon' data-src={company.logo.secure_url || ''} alt={company.name} /></li>;
								})}</ul>;
							}) :
								(teacher.displayUniveristy === true) ? (() => {
									return <ul className='jr-partners__list'>{teacher.university.map(university => {
										return <li><img className='lazyload jr-partners__list--icon' data-src={university.logo.secure_url || ''} alt={university.name} /></li>;
									})}</ul>;
								}) :
									(teacher.highlights.length > 0) ? teacher.highlights.map((highlight, index) => {
										return <div className='tag' key={index}>{highlight}</div>;
									}) : ''
						}
					</div>
				</div>
			</div>
		</div>
	);
}