import { applicationConstants } from '../_constants';
import { applicationService } from '../_services';
import { alertActions } from '.';
import { history } from '../_helpers';

export const applicationActions = {
	submit,
	updateService,
	updateOtherInfo
};

function submit(data) {
	return dispatch => {

		dispatch(request({ data }));
		applicationService.submit(data)
			.then(
				data => {
					dispatch(success(data));
					//go to course selection page
					history.push('/application/service-type-selection');
				},
				error => {
					dispatch(failure(error));
					dispatch(alertActions.error(error));
				}
			);
	};

	//Action creator
	function request(data) { return { type: applicationConstants.SUBMIT_APPLICATION_REQUEST, data }; }
	function success(data) { return { type: applicationConstants.SUBMIT_APPLICATION_SUCCESS, data }; }
	function failure(error) { return { type: applicationConstants.SUBMIT_APPLICATION_FAILURE, error }; }
}

function updateService(data) {
	return dispatch => {
		dispatch(request({ data }));
		applicationService.update(data)
			.then(
				data => {
					dispatch(success(data));
					//go to confirmation page
					history.push('/application/other-info');
				},
				error => {
					dispatch(failure(error));
					dispatch(alertActions.error(error));
				}
			);
	};

	//Action creator
	function request(data) { return { type: applicationConstants.SUBMIT_APPLICATION_REQUEST, data }; }
	function success(data) { return { type: applicationConstants.SUBMIT_APPLICATION_SUCCESS, data }; }
	function failure(error) { return { type: applicationConstants.SUBMIT_APPLICATION_FAILURE, error }; }
}

function updateOtherInfo(data) {
	return dispatch => {
		dispatch(request({ data }));
		applicationService.update(data)
			.then(
				data => {
					dispatch(success(data));
					//go to confirmation page
					history.push('/application/confirmation');
				},
				error => {
					dispatch(failure(error));
					dispatch(alertActions.error(error));
				}
			);
	};

	//Action creator
	function request(data) { return { type: applicationConstants.SUBMIT_APPLICATION_REQUEST, data }; }
	function success(data) { return { type: applicationConstants.SUBMIT_APPLICATION_SUCCESS, data }; }
	function failure(error) { return { type: applicationConstants.SUBMIT_APPLICATION_FAILURE, error }; }
}
