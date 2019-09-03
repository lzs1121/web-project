import { courseConstants } from '../_constants';
import { courseService } from '../_services';
import { alertActions } from '.';

export const courseActions = {
	getAllCourses,
	getCourseById,
	getCourseByUni
};

function getAllCourses() {
	return dispatch => {
		dispatch(request());

		courseService.getAllCourses()
			.then(
				data => dispatch(success(data)),
				error => {
					dispatch(failure(error));
					dispatch(alertActions.error(error));
				}
			);
	};

	function request() { return { type: courseConstants.GET_COURSES_REQUEST }; }
	function success(data) { return { type: courseConstants.GET_COURSES_SUCCESS, data }; }
	function failure(error) { return { type: courseConstants.GET_COURSES_FAILURE, error }; }
}

function getCourseById(id) {
	return dispatch => {
		dispatch(request(id));

		courseService.getCourseById(id)
			.then(
				users => dispatch(success(users)),
				error => dispatch(failure(error))
			);
	};

	function request() { return { type: courseConstants.GET_COURSE_BY_ID_REQUEST, id }; }
	function success(data) { return { type: courseConstants.GET_COURSE_BY_ID_SUCCESS, data }; }
	function failure(error) { return { type: courseConstants.GET_COURSE_BY_ID_FAILURE, error }; }
}

function getCourseByUni(uniID) {
	return dispatch => {
		dispatch(request(uniID));

		courseService.getCourseByUni(uniID)
			.then(
				users => dispatch(success(users)),
				error => dispatch(failure(error))
			);
	};

	function request() { return { type: courseConstants.GET_COURSES_BY_UNIVERSITYID_REQUEST, uniID }; }
	function success(data) { return { type: courseConstants.GET_COURSES_BY_UNIVERSITYID_SUCCESS, data }; }
	function failure(error) { return { type: courseConstants.GET_COURSES_BY_UNIVERSITYID_FAILURE, error }; }

}