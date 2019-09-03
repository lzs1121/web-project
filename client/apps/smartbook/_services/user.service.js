// import config from 'config';
import { authHeader } from '../_helpers';

export const userService = {
	login,
	register,
	logout,
	getUser
};

const apiUrl = 'http://localhost:3000/api';

function login(email, password) {
	const requestOptions = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, password })
	};
	return fetch(`${apiUrl}/login`, requestOptions)
		.then(handleResponse)
		.then(user => {
			// login successful if there's a jwt token in the response
			if (user.token) {
				// store user details and jwt token in local storage to keep user logged in between page refreshes
				localStorage.setItem('user', JSON.stringify(user));
			}

			return user;
		});
}

function register(firstname, lastname, email, password) {
	const requestOptions = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			name: {
				first: firstname,
				last:lastname
			},
			email,
			password
		})
	};
	return fetch(`${apiUrl}/signup`, requestOptions)
		.then(handleResponse)
		.then(user => {
			// login successful if there's a jwt token in the response
			if (user.token) {
				// store user details and jwt token in local storage to keep user logged in between page refreshes
				localStorage.setItem('user', JSON.stringify(user));
			}

			return user;
		});
}


function logout() {
	// remove user from local storage to log user out
	localStorage.removeItem('user');
}

function getUser() {
	const requestOptions = {
		method: 'GET',
		headers: authHeader()
	};

	return fetch(`${apiUrl}/user/get`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
	return response.json().then(data => {
		if (!response.ok) {
			if (response.status === 401) {
				// auto logout if 401 response returned from api
				logout();
				location.reload(true);
			}

			const error = (data && data.error) || response.statusText;
			return Promise.reject(error);
		}

		return data;
	});
}