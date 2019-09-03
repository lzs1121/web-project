import { servicesConstants } from '../_constants';
import { serviceTypeService } from '../_services';

export const serivceActions = {
	getAllServices,
	getServiceById,
	getServicesByType
};

function getAllServices() {
	return dispatch => {
		dispatch(request());

		serviceTypeService.getAllServicesType()
			.then(
				data => dispatch(success(data)),
				error => {
					dispatch(failure(error));
				}
			);
	};

	function request() { return { type: servicesConstants.GET_SERVICES_REQUEST }; }
	function success(data) { return { type: servicesConstants.GET_SERVICES_SUCCESS, data }; }
	function failure(error) { return { type: servicesConstants.GET_SERVICES_FAILURE, error }; }
}

function getServiceById(id) {
	return dispatch => {
		dispatch(request(id));

		serviceTypeService.getServicesType(id)
			.then(
				data => dispatch(success(data)),
				error => dispatch(failure(error))
			);
	};

	function request() { return { type: servicesConstants.GET_COURSE_BY_ID_REQUEST, id }; }
	function success(data) { return { type: servicesConstants.GET_COURSE_BY_ID_SUCCESS, data }; }
	function failure(error) { return { type: servicesConstants.GET_COURSE_BY_ID_FAILURE, error }; }
}

function getServicesByType(serviceType) {
	return dispatch => {
		dispatch(request(serviceType));

		serviceTypeService.getServicesByType(serviceType)
			.then(
				data => dispatch(success(data)),
				error => dispatch(failure(error))
			);
	};

	function request() { return { type: servicesConstants.GET_COURSE_BY_TYPE_REQUEST, serviceType }; }
	function success(data) { return { type: servicesConstants.GET_COURSE_BY_TYPE_SUCCESS, data }; }
	function failure(error) { return { type: servicesConstants.GET_COURSE_BY_TYPE_FAILURE, error }; }
}