// import { keystone } from 'keystone';
const keystone = require('keystone');

const Student = keystone.list('Student');

exports.get = (req, res) =>{
	res.apiResponse({

	});
};

exports.create = ( req, res ) => {
	const student = new Student.model();
	const data = (req.method === 'POST') ? req.body: req.query;

	student.getUpdateHandler(req).process(data, (err)=>{
		if(err) return res.apiError('error', err);

		res.apiResponse({
			status: 200
		});
	});
};
