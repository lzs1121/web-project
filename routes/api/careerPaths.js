const keystone = require('keystone');

const CareerPath = keystone.list('CareerPath');

exports.list = function(req, res) {
	CareerPath.model.find()
		.exec(function(err, careerPath) {
			if (err) res.err(careerPath);
			res.apiResponse({
				status:200,
				data: careerPath
			});
		});
};