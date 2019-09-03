import React, { Component } from 'react';
import { fetchUniversity, fetchCourse } from '../../api/categoryNavigation';
import axios from 'axios';
import subpageFunctions from './subpageFunctions';

class TutorialCore extends Component {
	constructor(prop) {
		super(prop);
		this.state = {
			universities: [],
			courses: [],
			total: 0,
			cardCountInPg: 9,
			currentPage: 1,
			categorySelected: 0,
			categories: [],
			defaultCategory: { name: '不限', _id: 0 },
			isLoading: true
		};
		this.onPageChange = this.onPageChange.bind(this);
		this.onCategoryBtnClick = this.onCategoryBtnClick.bind(this);
		this._isMounted = false;
	}

	componentDidMount() {
		this._isMounted = true;
		axios.all([
			fetchUniversity(),
			fetchCourse()
		]).then(axios.spread((universities, courses) => {
			const categories = universities.map(
				uni => {
					return { name: uni.chineseName, _id: uni._id };
				});
			const newCategories = (categories.map(category => {
				if(courses.some(course=>{
					return category._id === course.university._id;
				})) return category;
			})).filter(element => {
				return element != null;
			});
			newCategories.unshift(this.state.defaultCategory);
			if (this._isMounted) {
				this.setState({ isLoading: false, universities, courses, categories: newCategories });
			}
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
		const { currentPage, cardCountInPg, courses, categorySelected, categories, isLoading } = this.state;
		const filtedCourses = categorySelected === 0 ? courses : courses.filter(course => course.university._id === categorySelected);
		return (
			isLoading ? this.props.showSpin()
				:<div className='container'>
					<div className='category-button-container'>
						{this.props.showCategoryBtn(categories, categorySelected, this)}
					</div>
					<div className='cards-container'>
						<div className='row'>
							{
								this.props.showCards(filtedCourses, currentPage, cardCountInPg, 'tutorial')
							}
						</div>
					</div>
					<div className='pagination-container'>
						{this.props.showPagination(filtedCourses.length, cardCountInPg, this.onPageChange)}
					</div>
				</div>
		);
	}
}

const Tutorial = subpageFunctions(TutorialCore);
export default Tutorial;