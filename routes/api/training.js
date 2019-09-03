const keystone = require('keystone');
const Training = keystone.list('Training');

exports.list = function (req, res) {
	const query = Training.model.find();
	if (req.query.extend !== undefined) {
		const extendQuery = req.query.extend.split(',').map(ref => ({
			path: ref,
			select: 'name',
		}));
		query.populate(extendQuery);
	}
	query.exec(function (err, enrollment) {
		if (err) res.err(enrollment);
		res.apiResponse(enrollment);
	});
};
exports.listTrainingShort = function (req, res) {
	const courseList = [];
	Training.model.find()
		.exec(function (err, courses) {
			if (err) res.err(courses);
			for (const course of courses) {
				courseList.push({
					id: course._id,
					title: course.name,
					link: course.slug,
					city: course.city
				});
			}
			res.apiResponse({
				status: 200,
				data: courseList
			});
		});
};
exports.get = (req, res) => {
	Training.model.findById(req.params.id).populate('city technologyStack').exec((err, item) => {
		if (err) return res.json({ err: err });
		if (!item) return res.json('not found');

		res.json({
			status: 200,
			enrollment: item
		});
	});
};
