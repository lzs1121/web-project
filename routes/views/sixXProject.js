const keystone = require('keystone');
const teachers = keystone.list('Teacher');
const courses = keystone.list('Training');
const posts = keystone.list('Post');
exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	locals.filters = {
		slug: req.params.slug
	};

	locals.data = {
		slug: []
	};
	locals.projects =[];
	locals.categories =[];
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'Web';
	locals.title = '商业项目培训生（原商业项目实习）|iOS Reactjs Nodejs Mobile开发 Blockchain 人工智能 培训 | 澳洲IT匠人圈';
	locals.metaDescription = '澳洲IT，CS，数据科学DS，iOS，项目开发，BA商业数据分析，产品经理，UX，UI，实习生培养计划，通过商业项目获得本地项目经验，真实案例，上线项目，内推工作和提供工作证明和Referral。';
	// Render the view
	view.on('init', function (next) {
		const q = courses.model.findOne({
			courseCode: 'weba1811'
		});
		q.populate('project teacher').exec(function (err, result) {
			locals.data = result;
			if(locals.data.project) {
				locals.data.project.map(e => {
					e.teacher.map( teacherId => {
						teachers.model.find()
							.where('_id', teacherId)
							.exec(function(err, result) {
								if (err) res.err(err);
								e.teacher = result[0];

							});
					});
				});
			}
			next(err);
		});
	});

	view.on('init', function (next) {
		const post = posts
			.paginate({
				page: req.query.page || 1,
				perPage: 10,
				maxPages: 1,
				filters: {
					state: 'published',
					'training': locals.data.id
				}
			}).sort('-publishedDate').populate('author categories').limit(10);

		post.exec(function (err, results) {
			locals.posts = results;
			next(err);
		});
	});
	view.render('sixXProject');
};
