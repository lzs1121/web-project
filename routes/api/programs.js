const keystone = require('keystone');
const Program = keystone.list('Program');

exports.list = function (req, res) {
	Program.model.find()
		.sort('commenceCourseDate')
		.populate('city training')
		.exec(function (err, programs) {
			if (err) res.err(err);
			if (req.query.commenceCourseDate) {
				const commenceCourseDate = new Date(req.query.commenceCourseDate);
				if (!isNaN(commenceCourseDate)) {
					programs = programs.filter(program => {
						return program.commenceCourseDate > commenceCourseDate;
					});
				}
			}
			res.apiResponse(programs);
		});
};
