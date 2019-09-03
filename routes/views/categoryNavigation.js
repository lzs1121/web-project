const keystone = require('keystone');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'categoryNavigation';
	locals.title = '澳洲匠人学院信息导航：课程培训，大学辅导，求职服务，导师简介 | 澳洲IT匠人圈';
	locals.metaDescription = '信息导航，课程培训，大学辅导，求职服务，导师简介，零基础转行做IT，从入门到就业，Web开发，iOS开发，全栈班，数据科学，数据分析，SEO，大数据，数据库，python培训等。澳洲求职就业，面试指导，澳洲实习找工作。';

	view.render('categoryNavigation');
};