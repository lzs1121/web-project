const React = require('react');
const ReactDOM = require('react-dom');

import CategoryNavigation from './categoryNavigation';

const categoryNavigation = document.getElementById('categoryNavigation');

if (categoryNavigation) {
	ReactDOM.render(<CategoryNavigation />, categoryNavigation);
}
