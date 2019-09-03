const keystone = require('keystone');
const trainings = keystone.list('Training');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);

	const locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'search';
	locals.thumbnailSrc = '';
	locals.tutors = [];
	//Search Filter req: tutorials/?city={citySlug}&university={universitySlug}
	locals.filters= {
		city: req.query.city,
		university: req.query.university,
		tag:req.query.tech,
		tutor: req.query.tutor
	};

	view.on('init', function (next) {
		trainings.model.find()
			.where('city', locals.filters.city)
			.exec(function(err, results) {
				if (err) res.err(err);
				locals.trainings = results;
				next();
			});
	});


	// Render the view
	view.render('search');
};
