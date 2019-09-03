const config = require('../_config/config.json');

export const courseService = {
	getAllCourses,
	getCourseById,
	getCourseBySlug,
	getCourseByUni,
	getAllTrainings,
	getTrainingsById,
	getTrainingsBySlug
};

function getAllCourses() {
	const requestOptions = {
		method: 'GET'
	};
	return fetch(`${config.apiUrl}/course`, requestOptions).then(handleResponse);
}


function getCourseById(id) {
	const requestOptions = {
		method: 'GET'
	};
	return fetch(`${config.apiUrl}/course/${id}`, requestOptions).then(handleResponse);
}

function getCourseBySlug(slug) {
	const requestOptions = {
		method: 'GET'
	};
	return fetch(`${config.apiUrl}/course/${slug}`, requestOptions).then(handleResponse);
}

function getCourseByUni(uniId) {
	const requestOptions = {
		method: 'GET'
	};
	return fetch(`${config.apiUrl}/course/university/${uniId}`, requestOptions).then(handleResponse);
}

function getAllTrainings() {
	const requestOptions = {
		method: 'GET'
	};
	return fetch(`${config.apiUrl}/training`, requestOptions).then(handleResponse);
}

function getTrainingsById(id) {
	const requestOptions = {
		method: 'GET'
	};
	return fetch(`${config.apiUrl}/course/${id}`, requestOptions).then(handleResponse);
}

function getTrainingsBySlug(slug) {
	const requestOptions = {
		method: 'GET'
	};
	return fetch(`${config.apiUrl}/course/${slug}`, requestOptions).then(handleResponse);
}
function handleResponse(response) {
	return response.json().then(data => {
		if (!response.ok) {
			if (response.status === 401) {
				// auto logout if 401 response returned from api
				location.reload(true);
			}

			const error = (data && data.error) || response.statusText;
			return Promise.reject(error);
		}

		return data;
	});
}