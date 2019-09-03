const keystone = require('keystone');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);

	const locals = res.locals;

	locals.section = 'test';
	locals.title = 'test';
	locals.metaDescription = 'test';
	locals.path='search';
	view.render('test');
};
