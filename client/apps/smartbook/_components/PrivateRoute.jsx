import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const PrivateRoute = ({ component: Component, ...rest }) => (
	<Route {...rest} render={props => (
		localStorage.getItem('user')
			? <Component {...props} />
			: <Redirect to={{ pathname: '/application', state: { from: props.location } }} />
	)} />
);