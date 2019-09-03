const keystone = require('keystone');
const offers = keystone.list('Testimonial');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);

	const locals = res.locals;

	locals.section = 'offer-board';
	locals.title = 'Offer 榜| 澳洲匠学院Offer榜 ，澳洲最大IT从业者组织，求职招聘，职业培训';
	locals.metaDescription = 'Offer榜 | 澳洲最好的IT培训平台，来自Google等澳洲一线二线公司的导师，帮助学生更好的Code Bootcamp，求职辅导，布里斯班，悉尼，墨尔本，塔斯马尼亚，堪培拉';
	locals.offers =[];

	view.on('init', function (next) {
		offers.model.find()
			.sort('-publishedAt')
			.exec(function(err, result) {
				if (err) res.err(err);
				locals.offers = result;
				next();
			});
	});

	view.render('testimonial/offerBoard');
};
