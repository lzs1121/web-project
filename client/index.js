const React = require('react');
const ReactDOM = require('react-dom');
import EventApplication from './apps/contacts/event-application.jsx';
import WorkshopApplication from './apps/workshopApplication/workshop-application';
import ResourcePanel from './apps/resources/resource-panel.jsx';

import SmartBookApp from './apps/smartbook/smartBook.jsx';
import SearchResultsCards from './apps/searchBar/search-results-component';
import { store as smartBookStore } from './apps/smartbook/_helpers';

import { Provider } from 'react-redux';

const smartBookAppTarget = document.getElementById('smartBook');
const eventApplication = document.getElementById('eventapplication');
const workshopApplication = document.getElementById('workshopApplication');
const resourcePanelTarget = document.getElementById('resourcePanel');
const searchResultsCards = document.getElementById('searchResultsCards');

if (eventApplication) {
	ReactDOM.render(<EventApplication />, eventApplication);
} else if (workshopApplication) {
	ReactDOM.render(<WorkshopApplication />, workshopApplication);
} else if (resourcePanelTarget) {
	ReactDOM.render(
		<ResourcePanel data={resourcePanelTarget.dataset.resources} />,
		resourcePanelTarget
	);
}
if (smartBookAppTarget) {
	ReactDOM.render(
		<Provider store={smartBookStore}>
			<SmartBookApp url="/api/" />
		</Provider>,
		smartBookAppTarget
	);
}
if (searchResultsCards) {
	ReactDOM.render(<SearchResultsCards />, searchResultsCards);
}

