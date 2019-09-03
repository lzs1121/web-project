const config = require('../_config/config.json');

export const cityService = {
	getAllCities
};

function getAllCities() {
	const requestOptions = {
		method: 'GET'
	};
	return fetch(`${config.apiUrl}/cities`, requestOptions).then(handleResponse);
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