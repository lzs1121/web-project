import React, { Component } from 'react';
import { fetchTraining, fetchTechnologyStack } from '../../api/categoryNavigation';
import axios from 'axios';
import subpageFunctions from './subpageFunctions';

class TrainingCore extends Component {
	constructor(prop) {
		super(prop);
		this.state = {
			courses: [],
			total: 0,
			cardCountInPg: 6,
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
			fetchTraining(),
			fetchTechnologyStack()
		]).then(axios.spread((trainingCourses, techologyStacks) => {
			let categories = techologyStacks.map(tech => {
				if(trainingCourses.some(course=>{
					return course.technologyStack.some(t => t === tech._id);
				}))
					return tech;
			}).filter(element => {
				return element != null;
			});
			categories.unshift(this.state.defaultCategory);
			if (this._isMounted)
				this.setState({ isLoading: false, courses: trainingCourses, categories });
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
		const { currentPage, cardCountInPg, courses, categories, categorySelected, isLoading } = this.state;
		const filtedCourses = categorySelected === 0 ? courses : courses.filter(course =>
			course.technologyStack.includes(categorySelected)
		);
		return (
			isLoading ? this.props.showSpin()
				:<div className='container'>
					<div className='category-button-container'>
						{this.props.showCategoryBtn(categories, categorySelected, this)}
					</div>
					<div className='cards-container'>
						<div className='row'>
							{
								this.props.showCards(filtedCourses, currentPage, cardCountInPg)
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

const Training = subpageFunctions(TrainingCore);
export default Training;
