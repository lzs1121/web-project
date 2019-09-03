import { servicesConstants } from '../_constants';

export function services(state = {}, action) {
	switch (action.type) {
	case servicesConstants.GET_SERVICES_REQUEST:
		return {
			loading: true
		};
	case servicesConstants.GET_SERVICES_SUCCESS:
		return {
			data: action.data.services
		};
	case servicesConstants.GET_SERVICES_FAILURE:
		return {
			error: action.error
		};
	case servicesConstants.GET_COURSE_BY_TYPE_REQUEST:
		return {
			loading: true
		};
	case servicesConstants.GET_COURSE_BY_TYPE_SUCCESS:
		return {
			data: action.data.services
		};
	case servicesConstants.GET_COURSE_BY_TYPE_FAILURE:
		return {
			error: action.error
		};
	default:
		return state;
	}
}