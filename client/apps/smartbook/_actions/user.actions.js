import { userConstants } from '../_constants';
import { userService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const userActions = {
	login,
	register,
	logout,
	getUser
};

function login(email, password) {
	return dispatch => {
		dispatch(request({ email }));

		userService.login(email, password)
			.then(
				user => {
					dispatch(success(user));
					history.push('/test');
				},
				error => {
					dispatch(failure(error));
					dispatch(alertActions.error(error));
				}
			);
	};

	function request(user) { return { type: userConstants.LOGIN_REQUEST, user }; }
	function success(user) { return { type: userConstants.LOGIN_SUCCESS, user }; }
	function failure(error) { return { type: userConstants.LOGIN_FAILURE, error }; }
}

function register(firstname, lastname, email, password) {
	return dispatch => {
		dispatch(request({ email }));

		userService.register(firstname, lastname, email, password)
			.then(
				user => {
					dispatch(success(user));
					history.push('/test');
				},
				error => {
					dispatch(failure(error));
					dispatch(alertActions.error(error));
				}
			);
	};

	function request(user) { return { type: userConstants.REGISTER_REQUEST, user }; }
	function success(user) { return { type: userConstants.REGISTER_SUCCESS, user }; }
	function failure(error) { return { type: userConstants.REGISTER_FAILURE, error }; }
}

function logout() {
	userService.logout();
	return { type: userConstants.LOGOUT };
}

function getUser() {
	return dispatch => {
		dispatch(request());

		userService.getUser()
			.then(
				users => dispatch(success(users)),
				error => dispatch(failure(error))
			);
	};

	function request() { return { type: userConstants.GETALL_REQUEST }; }
	function success(users) { return { type: userConstants.GETALL_SUCCESS, users }; }
	function failure(error) { return { type: userConstants.GETALL_FAILURE, error }; }
}