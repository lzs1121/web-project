// import { keystone } from 'keystone';
const keystone = require('keystone');

const technologyStack = keystone.list('TechnologyStack');

exports.list = function(req, res) {
	technologyStack.model.find()
		.exec(function(err, technology) {
			if (err) res.err(technology);
			res.apiResponse({
				status:200,
				data: technology
			});
		});
};