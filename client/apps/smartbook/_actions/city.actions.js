import { cityConstants } from '../_constants';
import { cityService } from '../_services';
import { alertActions } from '.';

export const cityActions = {
	getAllCities
};

function getAllCities() {
	return dispatch => {
		dispatch(request());

		cityService.getAllCities()
			.then(
				data => dispatch(success(data)),
				error => {
					dispatch(failure(error));
					dispatch(alertActions.error(error));
				}
			);
	};


	function request() { return { type: cityConstants.GET_CITIES_REQUEST }; }
	function success(data) { return { type: cityConstants.GET_CITIES_SUCCESS, data }; }
	function failure(error) { return { type: cityConstants.GET_CITIES_FAILURE, error }; }
}