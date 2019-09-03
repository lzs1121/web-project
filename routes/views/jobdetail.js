const keystone = require('keystone');
const jobs = keystone.list('Job');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'Job';

	Object.assign(locals, {
		title:'',
		metaTitle:'',
		metaDescription:'',
		metaKeywords:''
	});

	// Render the view

	view.on('init', function (next) {
		jobs.model.find()
			.where('key', req.params.key)
			.populate('company')
			.exec(function(err, result) {
				if (err) res.err(err);
				locals.job = result[0];
				locals.title = `${locals.job.title} - ${locals.job.company.name}`;
				locals.metaTitle = `${locals.job.meta.title} - 澳洲IT求职找工作|Jobs in Australia`;
				locals.metaDescription = `${locals.job.meta.description} - 澳洲IT求职找工作|Jobs in Australia`;
				locals.metaKeywords = `${locals.job.meta.keywords}`;
				locals.thumbnailSrc = result[0].company.logo.secure_url || '';
				next();
			});
	});

	view.query('theJob',
		jobs.model.find()
			.where('key', req.params.key)
			.populate('categories')
			.populate('company')
			.populate('city')
	);

	view.render('jobboard/jobDetail');
};
