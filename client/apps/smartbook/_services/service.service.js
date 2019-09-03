const config = require('../_config/config.json');

export const serviceTypeService = {
	getAllServicesType,
	getServicesTypeById,
	getServicesByType
};

function getAllServicesType() {
	const requestOptions = {
		method: 'GET'
	};
	return fetch(`${config.apiUrl}/services`, requestOptions).then(handleResponse);
}
function getServicesTypeById(id) {
	const requestOptions = {
		method: 'GET'
	};
	return fetch(`${config.apiUrl}/services/${id}`, requestOptions).then(handleResponse);
}
function getServicesByType(type) {
	const requestOptions = {
		method: 'GET'
	};
	return fetch(`${config.apiUrl}/services?type=${type}`, requestOptions).then(handleResponse);
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