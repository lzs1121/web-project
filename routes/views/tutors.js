// Deprecated
const keystone = require('keystone');
const tutors = keystone.list('Tutor');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'Tutors';
	locals.tutors = [];

	view.on('init', function (next) {
		tutors.model.find()
			.sort('-priority')
			.exec(function(err, tutors) {
				if (err) res.err(err);
				locals.tutors = tutors;
				next();
			});
	});

	view.render('tutors');
};
