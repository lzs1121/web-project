const keystone = require('keystone');
const Universities = keystone.list('University');

exports.list = function(req, res) {
	const query = Universities.model.find();
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

exports.get = function(req, res) {
	const universityId = req.params.id;
	Universities.model.findById(universityId)
		.exec((err, data) => {
			if(err) return res.json({ err:err });
			if(!data) return res.json('not found');
			return res.json({
				status: 200,
				data: data
			});
		});
};

exports.getListByCityId = function(req, res) {
	const { cityId }= req.params;
	Universities.model.find({ city:cityId })
		.exec(function(err, universities) {
			if (err) res.err(universities);
			res.apiResponse(universities);
		});
};