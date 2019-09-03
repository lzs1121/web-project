import { trainingConstants } from '../_constants';
import { trainingService } from '../_services';

export const trainingActions = {
	getAllTrainings
};

function getAllTrainings() {
	return dispatch => {
		dispatch(request());

		trainingService.getAllTrainings()
			.then(
				data => dispatch(success(data)),
				error => {
					dispatch(failure(error));
				}
			);
	};

	function request() { return { type: trainingConstants.GET_TRAININGS_REQUEST }; }
	function success(data) { return { type: trainingConstants.GET_TRAININGS_SUCCESS, data }; }
	function failure(error) { return { type: trainingConstants.GET_TRAININGS_FAILURE, error }; }
}
