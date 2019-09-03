const keystone = require('keystone');
const Course = keystone.list('Course');
const University = keystone.list('University');
const Tutor = keystone.list('Tutor');
const async = require('async');


exports.list = function(req, res) {
	const query = Course.model.find();
	const expandFlag = 'populated';
	if (req.query) {
		const expandFields = Object.keys(req.query).filter(key=>req.query[key]===expandFlag);
		if (expandFields) {
			const expandQuery = expandFields.map(ref => (
				{
					path: ref,
					select: 'name',
				}));
			query.populate(expandQuery);
		}
	}
	query.exec(function (err, uni) {
		if (err) res.err(uni);
		res.apiResponse(uni);
	});
};
exports.listCourseWithUni = function (req, res) {
	Course.model.find({})
		.populate({ path: 'university', select: { 'name': '', 'chineseName': '', 'slug': '' } })
		.exec(function (err, enrollment) {
			if (err) res.err(enrollment);
			res.apiResponse(enrollment);
		});
};
exports.listCourseShort = function (req, res) {
	const courseList = [];
	Course.model.find()
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

exports.get = function (req, res) {
	const courseId = req.params.id;
	const course = {
		details: {},
		university: {},
		tutor: {}
	};
	async.series([
		function (next) {
			Course.model.findOne({ slug: courseId }).exec((err, item) => {
				if (err) return res.json({ err: err });
				if (!item) return res.json('not found');
				course.details = item;
				return next();
			});
		},
		function (next) {
			if (!course.details) return next();
			University.model.findById(course.details.university).exec((err, item) => {
				if (err) return res.json({ err: err });
				if (!item) return next();
				course.university = item;
				return next();
			});
		},
		function (next) {
			if (!course.details) return next();
			Tutor.model.find()
				.where('course')
				.in([course.details.id])
				.exec((err, item) => {
					if (err) return res.json({ err: err });
					if (!item) return next();
					course.tutor = item;
					return next();
				});
		},
		function () {
			res.json({
				status: 200,
				data: course
			});
		}
	]);
};


exports.getCourseByUni = (req, res) => {
	//the inputType make the first letter of the input string uppercase
	//Because all types in services (Training, Tutoring, and Career) are first letter uppercased.
	//const inputType = req.params.type.charAt(0).toUpperCase() + req.params.type.slice(1);
	Course.model.find({ university: req.params.uniId }).exec((err, item) => {
		if (err) return res.json({ err: err });
		if (!item) return res.json('not found');
		res.json({
			item
		});
	});
};