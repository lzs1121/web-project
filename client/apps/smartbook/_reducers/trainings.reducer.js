import { trainingConstants } from '../_constants';

export function trainings(state = {}, action) {
	switch (action.type) {
	case trainingConstants.GET_TRAININGS_REQUEST:
		return {
			loading: true
		};
	case trainingConstants.GET_TRAININGS_SUCCESS:
		return {
			data: action.data
		};
	case trainingConstants.GET_TRAININGS_FAILURE:
		return {
			error: action.error
		};
	default:
		return state;
	}
}