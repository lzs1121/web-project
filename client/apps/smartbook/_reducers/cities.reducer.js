import { cityConstants } from '../_constants';

export function cities(state = {}, action) {
	switch (action.type) {
	case cityConstants.GET_CITIES_REQUEST:
		return {
			loading: true
		};
	case cityConstants.GET_CITIES_SUCCESS:
		return {
			data: action.data
		};
	case cityConstants.GET_CITIES_FAILURE:
		return {
			error: action.error
		};
	default:
		return state;
	}
}