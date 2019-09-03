import React, { Component } from 'react';
export default class TrainingCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			course: this.props.course
		};
		this.getCourseLink = this.getCourseLink.bind(this);
		this.getThumbnail = this.getThumbnail.bind(this);
	}

	getCourseLink(course) {
		if (course.courseLink)
		{ return '/' + course.courseLink; }
		return '/program-course/' + course.slug;
	}

	getThumbnail(course) {
		if (course.thumbnail)
		{ return course.thumbnail.secure_url; }
		return '/images/courses/default.png';
	}

	render() {
		const course = this.state.course;
		const courseLink = this.getCourseLink(course);
		const thumbnailLink = this.getThumbnail(course);

		return (
			<div className='col-12 col-sm-4 text-center jr-card-wrapper'>
				<div className='card card-plain'>
					<div className='card-img-top'>
						<a href={courseLink}>
							<img className='lazyload' src={thumbnailLink} alt={course.name} /></a>
					</div>
					<div className='card-text-block'>
						<h2 className='card-title'>
							<a href={courseLink} target='_blank'>
								{course.title}
							</a>
						</h2>
						<p className='card-description'>
							{course.cardDescription}
						</p>
						<div className='card-footer'>
							<a className='btn btn-lg' href={'/application?type=' + course.slug}>参加报名</a>
							<a className='btn btn-lg' href={courseLink}>了解更多</a>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
