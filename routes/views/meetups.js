import keystone from 'keystone';

const meetups = keystone.list('Meetup');

exports = module.exports = (req, res) => {
	const view = new keystone.View(req, res);
	const locals = res.locals;

	locals.section = 'meetups';
	locals.title = 'Meetups';
	locals.metaDescription = '澳大利亚布里斯班Brisbane IT培训  | 澳洲最大IT从业者组织，地跨悉尼（Sydney），墨尔本（Melbourne），布里斯班（Brisbane），有来自全球的四千多位小伙伴加入我们，北美，欧洲，日本，东南亚，因为有你，我们因此而不同';

	view.query('upcomingMeetups',
		meetups.model.find()
			.where('state', 'active')
			.sort('-startDate')
	);

	view.query('pastMeetups',
		meetups.model.find()
			.where('state', 'past')
			.sort('-startDate')
	);

	view.on('render', (next) => {
		if (!req.user || !locals.upcomingMeetup) return next();
	});

	view.render('meetups');
};
