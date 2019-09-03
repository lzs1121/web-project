import { courseConstants } from '../_constants';

export function courses(state = {}, action) {
	switch (action.type) {
	case courseConstants.GET_COURSES_REQUEST:
		return {
			loading: true
		};
	case courseConstants.GET_COURSES_SUCCESS:
		return {
			data: action.data
		};
	case courseConstants.GET_COURSE_BY_SLUG_FAILURE:
		return {
			error: action.error
		};
	case courseConstants.GET_COURSES_BY_UNIVERSITYID_REQUEST:
		return {
			loading: true
		};
	case courseConstants.GET_COURSES_BY_UNIVERSITYID_SUCCESS:
		return {
			data: action.data.item
		};
	case courseConstants.GET_COURSES_BY_UNIVERSITYID_FAILURE:
		return {
			error: action.error
		};


	default:
		return state;
	}
}

export function course(state = {}, action) {
	switch (action.type) {
	case courseConstants.GET_COURSE_BY_ID_REQUEST:
		return {
			loading: true
		};
	case courseConstants.GET_COURSE_BY_ID_SUCCESS:
		return {
			items: action.data
		};
	case courseConstants.GET_COURSE_BY_ID_FAILURE:
		return {
			error: action.error
		};
	default:
		return state;
	}
}