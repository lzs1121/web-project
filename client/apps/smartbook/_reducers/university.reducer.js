import { universityConstants } from '../_constants';

export function university(state = {}, action) {
	switch (action.type) {
	case universityConstants.GET_UNIVERSITIES_REQUEST:
		return {
			loading: true
		};
	case universityConstants.GET_UNIVERSITIES_SUCCESS:
		return {
			data: action.data
		};
	case universityConstants.GET_UNIVERSITIES_FAILURE:
		return {
			error: action.error
		};
	default:
		return state;
	}
}