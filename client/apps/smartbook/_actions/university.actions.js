import { universityConstants } from '../_constants';
import { universityService } from '../_services';
import { alertActions } from '.';

export const universityActions = {
	getAllUniversities
};

function getAllUniversities() {
	return dispatch => {
		dispatch(request());

		universityService.getAllUniversities()
			.then(
				data => dispatch(success(data)),
				error => {
					dispatch(failure(error));
					dispatch(alertActions.error(error));
				}
			);
	};


	function request() { return { type: universityConstants.GET_UNIVERSITIES_REQUEST }; }
	function success(data) { return { type: universityConstants.GET_UNIVERSITIES_SUCCESS, data }; }
	function failure(error) { return { type: universityConstants.GET_UNIVERSITIES_FAILURE, error }; }
}