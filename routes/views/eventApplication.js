const keystone = require('keystone');
const meetups = keystone.list('Meetup');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'Event';
	locals.title = '澳洲IT匠人圈活动 | 澳洲IT匠人圈 ，澳洲最大IT从业者组织，求职招聘，职业培训，项目合作';
	locals.metaDescription = '澳大利亚IT匠人圈活动  | 澳洲最大IT从业者组织，地跨悉尼（Sydney），墨尔本（Melbourne），布里斯班（Brisbane），有来自全球的四千多位小伙伴加入我们，北美，欧洲，日本，东南亚，因为有你，我们因此而不同';
	// Render the view
	view.query('curMeetups',
		meetups.model.findOne()
		//.where('state', 'past')
			.where('key', req.params.key)
	);

	view.render('eventApplication');
};
