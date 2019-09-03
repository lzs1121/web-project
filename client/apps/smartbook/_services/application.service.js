const config = require('../_config/config.json');

export const applicationService = {
	submit,
	update
};

function submit(data) {
	const requestOptions = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	};
	return fetch(`${config.apiUrl}/orders`, requestOptions)
		.then(handleResponse)
		.then(data => {
			return data;
		});
}

function update(data) {
	const requestOptions = {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	};
	//put data into backend
	return fetch(`${config.apiUrl}/orders/${data.orderId}`, requestOptions)
		.then(handleResponse)
		.then(data => {
			return data;
		});
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