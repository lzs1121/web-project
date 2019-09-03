// import { keystone } from 'keystone';
const keystone = require('keystone');

const Teacher = keystone.list('Teacher');

exports.get = (req, res) =>{
	res.apiResponse({
		status: 200
	});
};

exports.create = ( req, res ) => {
	const teacher = new Teacher.model();
	const data = (req.method === 'POST') ? req.body: req.query;

	teacher.getUpdateHandler(req).process(data, (err)=>{
		if(err) return res.apiError('error', err);

		res.apiResponse({
			status: 200
		});
	});
};

exports.list = function(req, res) {
	const { service, city } =req.query;
	if( service && city ) {
		Teacher.model.where('service').in([service])
			.where('city').in([city])
			.exec(function(err, teacher) {
				if (err) res.err(teacher);
				res.apiResponse({
					status:200,
					data: teacher
				});
			});
	}
	else{
		Teacher.model.find()
			.exec(function(err, teacher) {
				if (err) res.err(teacher);
				res.apiResponse({
					status:200,
					data: teacher
				});
			});
	}
};

exports.getTeachersByServiceSlug = (req, res) =>{
	const serviceSlug = req.params.slug;
	Teacher.model.find()
		.populate({
			path: 'service',
			match: { 'slug': { $eq: serviceSlug } },
			select: 'slug'
		})
		.exec(function(err, teacher) {
			if (err) res.err(teacher);
			const result = teacher.filter( item => item.service.length > 0);
			res.apiResponse({
				status:200,
				data:result,
			});
		});
};