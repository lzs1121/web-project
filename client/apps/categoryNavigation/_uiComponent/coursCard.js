import React from 'react';
export default function CourseCard(props) {
	const course = props.course;
	const uniName = course.university.chineseName;
	const uniSlug = course.university.slug;
	return (
		<div className='col-12 col-sm-4'>
			<div className='jr-card jr-course-card'>
				<div className='row'>
					<div className='col-1 text-center jr-course-card__icon'>
						<img className='lazyload' data-src='/images/icons/icon-star-small-yellow.svg' alt='coures icon' />
					</div>
					<div className='col-10 jr-course-card__title'>
						<a href={`/university/${uniSlug}/${course.slug}`}>
							<h4 className='bold'>{course.courseCode}</h4>
						</a>
						<a href={`/university/${uniSlug}/${course.slug}`}>
							<p className='course-name'>{course.name}</p>
						</a>
						<a href={`/university/${uniSlug}/${course.slug}`}>
							<p className='bold course-slug'>{uniName}</p>
						</a>
					</div>
					<div className='col-1 jr-course-card__link'>
						<a href={`/university/${uniSlug}/${course.slug}`}>
							<img className='lazyload' data-src='/images/icons/arrow-right-thin.svg' alt='card link' />
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}