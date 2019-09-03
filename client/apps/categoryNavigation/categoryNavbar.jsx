import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ToggleButton from './_uiComponent/toggleButton';

export default class CategoryNavbar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			navbarMobileTitle: '',
			navbarClassNames: ['nav-link selected', 'nav-link', 'nav-link', 'nav-link'],
			toggleBtnClassname: 'toggle-button',
			path: props.path || '',
			categories: {
				categoryPath: ['/category-navigation/training',
					'/category-navigation/tutorial',
					'/category-navigation/teacher'],
				categoryName: ['培训课程', '大学辅导', '导师简介']
			}
		};
		this.toggleClick = this.toggleClick.bind(this);
		this.categorySelected = this.categorySelected.bind(this);
		this.showNabrLinks = this.showNabrLinks.bind(this);
		this.getIndex = this.getIndex.bind(this);
	}

	componentDidMount() {
		let url = this.props.path;
		let { categoryPath, categoryName } = this.state.categories;
		let index = this.getIndex(url);
		this.categorySelected(index);
		this.setState({
			navbarMobileTitle: categoryName[index],
			path: categoryPath[index]
		});
	}

	getIndex(url) {
		let index = this.state.categories.categoryPath.findIndex((path) => {
			return url.includes(path);
		});
		if (index === -1)
			index = 0;
		return index;
	}

	toggleClick() {
		const linksEl = document.querySelector('.toggle-container__links');
		const toggleName = this.state.toggleBtnClassname;
		linksEl.style.display === 'block' ?
			linksEl.style.display = 'none' : linksEl.style.display = 'block';
		toggleName === 'toggle-button' ?
			this.setState({ toggleBtnClassname: 'toggle-button--close' }) :
			this.setState({ toggleBtnClassname: 'toggle-button' });
	}

	categorySelected(index, type) {
		let navbarClassNames = [];
		this.state.navbarClassNames.forEach((element, i) => {
			(i === index) ? navbarClassNames.push('nav-link selected') : navbarClassNames.push('nav-link');
		});
		if (type === 'mobile') {
			this.toggleClick();
			this.setState({
				navbarClassNames,
				navbarMobileTitle: this.state.categories.categoryName[index]
			});
		}
		else{
			this.setState({ navbarClassNames });
		}
	}

	showNabrLinks(categoryName, categoryPath, navbarClassNames, type) {
		let categories = [];
		for (let index = 0; index < categoryName.length; index++) {
			categories.push({
				categoryName: categoryName[index],
				categoryPath: categoryPath[index],
				navbarClassNames: navbarClassNames[index],
				type: type
			});
		}
		if (type === 'mobile') {
			return (
				categories.map(
					(category, index) => {
						return <Link exact='true' to={category.categoryPath} className={category.navbarClassNames}
							onClick={() => this.categorySelected(index, category.type)}
							key={index}>{category.categoryName}</Link>;
					}
				)
			);
		}
		return (
			categories.map(
				(category, index) => {
					return <li key={index}>
						<Link exact='true' to={category.categoryPath} className={category.navbarClassNames}
							onClick={() => this.categorySelected(index, category.type)}
							key={index}>{category.categoryName}</Link>
					</li>;
				}
			)
		);
	}

	render() {
		const { categoryName, categoryPath } = this.state.categories;
		const navbarClassNames = this.state.navbarClassNames;

		return (
			<React.Fragment>
				<div className='container'>
					<ul className='category-navbar'>
						{this.showNabrLinks(categoryName, categoryPath, navbarClassNames, 'big-screen')}
					</ul>
				</div>
				<div className='category-navbar-mobile'>
					<div className='category-navbar-mobile__title'>
						<h3>{this.state.navbarMobileTitle}</h3>
					</div>
					<div className='toggle-container'>
						<ToggleButton onClick={this.toggleClick} btnClassname={this.state.toggleBtnClassname} />
						<div className='toggle-container__links' >
							{this.showNabrLinks(categoryName, categoryPath, navbarClassNames, 'mobile')}
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}