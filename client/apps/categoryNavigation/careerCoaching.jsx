import React, { Component } from 'react';
import { fetchCareerCoaching } from '../../api/categoryNavigation';
import subpageFunctions from './subpageFunctions';

class CareerCoachingCore extends Component {
	constructor(prop) {
		super(prop);
		this.state = {
			services: [],
			total: 0,
			cardCountInPg: 6,
			currentPage: 1,
			categorySelected: 0,
			categories: [],
			defaultCategory: { name: '不限', _id: 0 },
			isLoading: true
		};
		this.onPageChange = this.onPageChange.bind(this);
		this._isMounted = false;
	}

	componentDidMount() {
		this._isMounted = true;
		fetchCareerCoaching().then(data => {
			if (this._isMounted) {
				this.setState({ isLoading: false, services: data });
			}
		}).catch(error => error);
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	onPageChange(activePage) {
		this.setState({ currentPage: activePage });
	}

	render() {
		const { currentPage, cardCountInPg, services, isLoading } = this.state;
		return (
			isLoading ? this.props.showSpin()
				:<div className='container'>
					<div className='category-button-container'>
						<div className='category-button-container__row' style={{ height: '31px' }}>
						</div>
					</div>
					<div className='cards-container'>
						<div className='row'>
							{
								this.props.showCards(services, currentPage, cardCountInPg, 'career-coaching')
							}
						</div>
					</div>
					<div className='pagination-container'>
						{this.props.showPagination(services.length, cardCountInPg, this.onPageChange)}
					</div>
				</div>
		);
	}
}

const CareerCoaching = subpageFunctions(CareerCoachingCore);
export default CareerCoaching;
