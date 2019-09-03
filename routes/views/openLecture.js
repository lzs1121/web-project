const keystone = require('keystone');
const tutors = keystone.list('Tutor');
const workshops = keystone.list('Workshop');
const { STATE_ACTIVE, TYPE_OPENLECTURE } = require('../../utils/constants');

exports = module.exports = function (req, res) {
	const view = new keystone.View(req, res);
	const locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'open-lecture';
	locals.title = 'IT匠人公开课，打造澳洲最专业的线上知识分享平台 | 澳洲匠人学院 ';
	locals.metaDescription = '拥有200多导师团队的大学辅导团队，针对澳洲布里斯班，墨尔本，悉尼，堪培拉，阿德莱德，塔斯马尼亚等澳洲大学课程辅导，涉及IT补课，补习，专业课程辅导，University Tutoring，考试冲刺，作业辅导，保过班，冲刺班';
	locals.metaKeywords = '布里斯班,悉尼,墨尔,堪培拉,塔斯马尼亚,阿德莱德,澳洲,大学辅导,IT补课,IT求职,作业辅导,考试冲刺';
	locals.thumbnailSrc = '/images/courses/open-lecture_default_thumbnail.jpg';
	locals.tutors = [];
	locals.workshops = [];

	view.on('init', function (next) {
		tutors.model.find()
			.sort('-priority')
			.exec(function(err, tutors) {
				if (err) res.err(err);
				locals.tutors = tutors;
				locals.workshops = tutors;
				next();
			});
	});

	view.on('init', function (next) {
		// filter workshops which are open-course, active,and later than current date
		const currentDate = Date.now();
		workshops.model.find()
			.where('state').equals(STATE_ACTIVE)
			.where('activityType').equals(TYPE_OPENLECTURE)
			.where('startDate').gte(currentDate)
			.sort('startDate')
			.exec(function(err, workshop) {
				if (err) res.err(err);
				locals.workshops = workshop;
				next(err);
			});
	});

	// Render the view
	view.render('openLecture');
};
