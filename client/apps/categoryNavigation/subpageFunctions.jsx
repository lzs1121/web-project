import React, { Component } from 'react';
import { Pagination } from 'antd';
import CategoryBtn from './_uiComponent/categoryBtn';
import TrainingCard from './_uiComponent/trainingCard';
import CourseCard from './_uiComponent/coursCard';
import TeacherCard from './_uiComponent/teacherCard';
import CareerCoachingCard from './_uiComponent/careerCoachingCard';

export default function subpageFunctions(WrappedComponent) {
	return class HOC extends Component {
		showSpin() {
			return <div className='react-preloader-container'>
				<div className='swiper-lazy-preloader subpage'></div>
			</div>;
		}

		showCategoryBtn(categories, categorySelected, obj) {
			return <div className='category-button-container__row'>
				{categories.map(
					(category, index) => {
						return <CategoryBtn key={index} category={category}
							onCategoryBtnClick={obj.onCategoryBtnClick}
							selected={category._id === categorySelected} />;
					}
				)}
			</div>;
		}

		showCards(cards, currentPage, cardCountInPg, type) {
			return cards.length > 0 ? (
				cards.slice((currentPage - 1) * cardCountInPg, currentPage * cardCountInPg)
					.map(
						(element, index) => {
							if (type === 'tutorial')
								return <CourseCard key={index} course={element} />;
							else if (type === 'career-coaching')
								return <CareerCoachingCard key={index} service={element} />;
							else if (type === 'teacher')
								return <TeacherCard key={element.name} teacher={element} />;
							return <TrainingCard key={element._id} course={element} />;
						}
					)
			) : '';
		}

		showPagination(total, cardCountInPg, onChange) {
			if (total > 0)
				return (<Pagination
					total={total}
					defaultCurrent={1}
					defaultPageSize={cardCountInPg}
					onChange={onChange} />
				);
		}

		render() {
			return <WrappedComponent {...this.props}
				showHOC={this.showHOC}
				showSpin={this.showSpin}
				showCategoryBtn={this.showCategoryBtn}
				onCategoryBtnClick={this.onCategoryBtnClick}
				showCards={this.showCards}
				showPagination={this.showPagination} />;
		}
	};
}
