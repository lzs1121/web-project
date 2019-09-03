const keystone = require('keystone');
const meetups = keystone.list('Meetup');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'events';
	locals.title = '澳洲匠人学院(澳洲IT匠人圈)线下线上活动 | 悉尼(Sydney),墨尔本(Melbourne),布里斯班（Brisbane)IT聚会活动 ';
	locals.metaDescription = '澳洲最大IT从业者组织，线上和线下活动，IT人自己的圈子。墨尔本，悉尼，布里斯班，堪培拉，阿德莱德，塔斯马尼亚IT人自己的聚会';
	// Render the view
	view.query('pastMeetups',
		meetups.model.find()
			.where('state', 'past')
			.sort('-startDate')
	);
	view.query('upcomingMeetups',
		meetups.model.find()
			.where('state', 'active')
			.sort('-startDate')
	);

	view.on('init', function (next) {

		const post = keystone.list('Post').paginate({
			page: req.query.page || 1,
			perPage: 2,
			maxPages: 1,
			filters: {
				state: 'published'
			}
		}).sort('-publishedDate').populate('author categories').limit(2);

		post.exec(function (err, results) {
			locals.posts = results;
			next(err);
		});
	});
	view.render('event');
};
