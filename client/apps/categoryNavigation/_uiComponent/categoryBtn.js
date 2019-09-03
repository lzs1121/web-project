import React from 'react';

export default function CategoryBtn(props) {
	return (
		<div className= 'category-btn-wrapper'>
			<span className={props.selected ? 'category-btn selected' : 'category-btn'} type='default' size='default'
				onClick={(event) => {
					event.preventDefault();
					props.onCategoryBtnClick(props.category._id);
				}}>
				{props.category.name}
			</span>
		</div>
	);
}