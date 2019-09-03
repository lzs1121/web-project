import React, { Component } from 'react';
import { fetchLecturer, fetchTutor } from '../../api/categoryNavigation';
import axios from 'axios';
import subpageFunctions from './subpageFunctions';

class TeacherCore extends Component {
	constructor(prop) {
		super(prop);
		this.state = {
			lecturers: [],
			tutors: [],
			teachers: [],
			total: 0,
			cardCountInPg: 6,
			currentPage: 1,
			categorySelected: 0,
			defaultCategory: { name: '不限', _id: 0 },
			categories: [],
			isLoading: true
		};
		this.onPageChange = this.onPageChange.bind(this);
		this.onCategoryBtnClick = this.onCategoryBtnClick.bind(this);
		this._isMounted = false;
	}

	componentDidMount() {
		this._isMounted = true;
		axios.all([
			fetchLecturer(),
			fetchTutor()
		]).then(axios.spread((lecturers, tutors) => {
			let newLecturers = lecturers.map(lecturer => {
				return ({
					categoryId: 1,
					avatar: lecturer.avatar,
					name: lecturer.name,
					title: lecturer.title,
					introduction: lecturer.introduction,
					highlights: lecturer.highlights
				});
			});
			let newTutors = tutors.map(
				tutor => {
					return {
						categoryId: 2,
						avatar: tutor.avatar,
						name: tutor.name,
						title: tutor.title,
						introduction: tutor.introduction,
						highlights: tutor.highlights
					};
				});
			let teachers = newLecturers.concat(newTutors);
			let categories = [{ _id: 0, name: '不限' }, { _id: 1, name: '培训课程' },
				{ _id: 2, name: '大学辅导', }];
			if (this._isMounted)
				this.setState({ isLoading: false, teachers, categories });
		})).catch(error => error);
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	onPageChange(activePage) {
		this.setState({ currentPage: activePage });
	}

	onCategoryBtnClick(categorySelected) {
		this.setState({ categorySelected, currentPage: 1 });
	}

	render() {
		let { currentPage, cardCountInPg, teachers, categorySelected, categories, isLoading } = this.state;
		let filtedTeachers = categorySelected === 0 ? teachers : teachers.filter(teacher => teacher.categoryId === categorySelected);
		return (
			isLoading ? this.props.showSpin() :
				<div className='container'>
					<div className='category-button-container'>
						{this.props.showCategoryBtn(categories, categorySelected, this)}
					</div>
					<div className='cards-container'>
						<div className='row'>
							{
								this.props.showCards(filtedTeachers, currentPage, cardCountInPg, 'teacher')
							}
						</div>
					</div>
					<div className='pagination-container'>
						{this.props.showPagination(filtedTeachers.length, cardCountInPg, this.onPageChange)}
					</div>
				</div>
		);
	}
}

const Teacher = subpageFunctions(TeacherCore);
export default Teacher;
