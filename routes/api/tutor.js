const keystone = require('keystone');

const Tutor = keystone.list('Tutor');

exports.get = (req, res) =>{
	const tutorId = req.params.id;
	Tutor.model.findById(tutorId)
		.populate('university')
		.populate('service')
		.populate('techSkills', 'name')
		.exec((err, item) => {
			if(err) return res.json({ err:err });
			if(!item) return res.json('not found');
			const tutor = {
				id:item._id,
				name: item.name,
				university:item.university,
				service:item.service,
				introduction: item.introduction,
				highlights: item.highlights,
				avatar: item.avatar,
				skills: item.techSkills,
				slogan: item.slogan,
				title: item.title,
				meetingTime: item.meetingTime,
				availableTime: '',
				videoLink: item.videoLink,
			};
			res.json({
				status: 200,
				data: tutor
			});
		});
};

exports.list = function(req, res) {
	const { course, university } =req.query;
	if( course && university) {
		Tutor.model.where('course').in([course])
			.where('university').in([university])
			.exec(function(err, tutor) {
				if (err) res.err(tutor);
				res.apiResponse({
					status:200,
					data: tutor
				});
			});
	}
	else{
		Tutor.model.find()
			.exec(function(err, tutor) {
				if (err) res.err(tutor);
				res.apiResponse({
					status:200,
					data: tutor
				});
			});
	}
};

exports.getTutorByService = function(req, res) {
	const serviceId = req.params.id;
	Tutor.model.find()
		.where('service')
		.in([serviceId])
		.exec((err, item)=> {
			if(err) return res.json({ err:err });
			if(!item) return res.json('not found');
			res.json({
				tutor: item
			});
		});
};