import { Component } from 'react';

export default class SearchResultsCards extends Component {
	constructor(props) {
		super(props);
		this.getKeywords = this.getKeywords.bind(this);
		this.courseSearching = this.courseSearching.bind(this);
	}

	getKeywords() {
		let url = new URL(location.href);
		let keywords = url.searchParams.get('keywords');
		return keywords;
	}

	courseSearching(myCourses, keywords) {
		let resultArray = [];
		if (myCourses.length > 0) {
			myCourses.map(course => {
				keywords.split('%20').map(word => {
					if ((course.name.toLowerCase().indexOf(word.toLowerCase()) != -1)
						|| (course.courseCode.toLowerCase().indexOf(word.toLowerCase()) != -1)) {
						resultArray.push({ name: course.name, slug: course.slug, courseCode: course.courseCode });
					}
				});
			});
		}
		return resultArray;
	}

	render() {
		let keywords = this.getKeywords();
		let courses = window.myCourses;
		let resultArray = this.courseSearching(courses, keywords);
		return (resultArray.length > 0 ?
			(
				resultArray.map((course, index) => {
					return (
						<CourseCard key={index} course={course}/>
					);
				})
			) : ''
		);
	}
}

function CourseCard(props) {
	return (
		<div className="col-sm-4">
			<div className="jr-card jr-courses-card--card">
				<div className="row">
					<div className="col-1 text-center jr-course-card--icon">
						<img className="lazyload" src="/images/icons/icon-star-small-yellow.svg" alt="coures icon" />
					</div>
					<div className="col-10 jr-course-card--title">
						<a href={props.course.slug}>
							<h4 className="bold">{props.course.courseCode}</h4>
						</a>
						<a href={props.course.slug}>
							<p>{props.course.name}</p>
						</a>
					</div>
					<div className="col-1 jr-course-card--cardLink">
						<a href={props.course.slug}>
							<img className="lazyload" src="/images/icons/arrow-right-thin.svg" alt="card link" />
						</a>
					</div>
				</div>
			</div>
		</div>
	)
}