import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Training from './training';
import Tutorial from './tutorial';
import CareerCoaching from './careerCoaching';
import Teacher from './teacher';

export default function routes(props) {
	return (
		<Switch>
			<Route exact path='/category-navigation' component={Training}/>
			<Route exact path='/category-navigation/training' component={Training}/>
			<Route exact path='/category-navigation/tutorial' component={Tutorial}/>
			<Route exact path='/category-navigation/career-coaching' component= {CareerCoaching}/>
			<Route exact path='/category-navigation/teacher' component={Teacher}/>
		</Switch>
	);
}