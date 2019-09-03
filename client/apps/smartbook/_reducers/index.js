import { combineReducers } from 'redux';

import { authentication } from './authentication.reducer';
import { users } from './users.reducer';
import { alert } from './alert.reducer';
import { application } from './application.reducer';
import { course, courses } from './course.reducer';
import { services } from './service.reducer';
import { university } from './university.reducer';
import { cities } from './cities.reducer';
import { trainings } from './trainings.reducer';

const rootReducer = combineReducers({
	authentication,
	users,
	alert,
	application,
	course,
	courses,
	services,
	university,
	cities,
	trainings
});

export default rootReducer;