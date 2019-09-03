import React, { Component } from 'react';
import { Router } from 'react-router-dom';
import CategoryNavbar from './categoryNavbar';
import Routes from './routes';
import { createBrowserHistory } from 'history';

export default class CategoryNavigation extends Component {
	constructor(props) {
		super(props);
		this.state = {
			path: history.location.pathname,
			isLoaded: false,
		};

		history.listen((location, action) => {
			if (action === 'POP') {
				this.setState({ path: location.pathname });
			}
		});
		this.disappearSpin = this.disappearSpin.bind(this);
	}

	componentDidMount() {
		this.setState({ isLoaded: true });
	}

	disappearSpin() {
		let container = document.getElementsByClassName('preloader-container')[0];
		container.style.display = 'none';
		container.getElementsByClassName('swiper-lazy-preloader')[0].style.display = 'none';
	}

	render() {
		let { path, isLoaded } = this.state;
		isLoaded ? this.disappearSpin() : '';
		return (
			<div className='category-navigation-container'>
				<Router history={history}>
					<div>
						<div className='category-navbar-container'>
							<CategoryNavbar path={path} action={history.action} key={history.location.key} />
						</div>
						<div className='category-navigation__content'>
							<Routes />
						</div>
					</div>
				</Router>
			</div>
		);
	}
}

export const history = createBrowserHistory();
