
const keystone = require('keystone');

const Cities = keystone.list('City');

exports.list = function(req, res) {
	Cities.model.find()
		.exec(function(err, cities) {
			if (err) res.err(cities);
			res.apiResponse(cities);
		});
};