const keystone = require('keystone');
const middleware = require('./middleware');
const importRoutes = keystone.importer(__dirname);
const restful = require('restful-keystone')(keystone);
const sitemap = require('keystone-express-sitemap');
const bodyParser = require('body-parser');

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);
keystone.pre('routes', middleware.initErrorHandlers);

// Import Route Controllers
const routes = {
	views: importRoutes('./views'),
	api: importRoutes('./api')
};

keystone.set('404', function (req, res) {
	res.notfound();
});

keystone.set('500', function (err, req, res) {
	let title, message;
	if (err instanceof Error) {
		message = err.message;
		err = err.stack;
	}
	res.err(err, title, message);
});

// Setup Route Bindings
exports = module.exports = function (app) {
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	app.all('/*', function (req, res, next) {
		const allowedOrigins = ['http://localhost:8000', 'https://learn.jiangren.com.au', 'http://learn.jiangren.com.au', 'http://127.0.0.1:8080', 'http://jrdashboard.s3-website-ap-southeast-2.amazonaws.com', 'd2dr4y4pdbldaw.cloudfront.net', 'http://uat-learn.jiangren.com.au.s3-website-ap-southeast-2.amazonaws.com'];
		const origin = req.headers.origin;
		if (allowedOrigins.indexOf(origin) > -1) {
			res.setHeader('Access-Control-Allow-Origin', origin);
		}
		res.header('Access-Control-Allow-Credentials', true);
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE, PATCH');
		res.header('Access-Control-Allow-Headers', 'Origin, Authorization, x-xsrf-token,X-Requested-With, Content-Type, Accept, x-access-token');
		//intercepts OPTIONS method
		if (req.method === 'OPTIONS') {
			//respond with 200
			res.send(200);
		} else {
			next();
		}
	});

	// Views
	app.get('/*', function (req, res, next) {
		if (req.url.indexOf('/images/') === 0 || req.url.indexOf('/styles/') === 0) {
			res.setHeader('Cache-Control', 'public, max-age=2592000');
			res.setHeader('Expires', new Date(Date.now() + 2592000000).toUTCString());
		}
		next();
	});

	app.get('/', routes.views.index);
	app.get('/about', routes.views.about);
	app.get('/policy', routes.views.policy);
	app.get('/curriculumVitae', routes.views.career.curriculumVitae);

	// Tutoring
	// app.get('/university', routes.views.universities);
	app.get('/university/:slug', routes.views.university);
	app.get('/university/:slug/results', routes.views.results);
	app.get('/university/:slug/:courseCode', routes.views.course);
	app.get('/program-courses', routes.views.trainings);
	app.get('/program-course/:slug', routes.views.training);
	app.get('/tutors', routes.views.tutors);
	app.get('/mentors/:id', routes.views.tutor);

	app.get('/career-coaching', routes.views.careerCoaching);
	app.get('/career-coaching/:slug', routes.views.career.careerService);
	app.get('/events', routes.views.event);
	app.get('/events/:key', routes.views.eventDetail);
	app.get('/category-navigation', routes.views.categoryNavigation);
	app.get('/category-navigation/*', routes.views.categoryNavigation);

	// Course Path
	app.get('/commercial-projects-training', routes.views.sixXProject);
	app.get('/web-development-bootcamp', routes.views.webdev);
	app.get('/web-development-introduction-bootcamp', routes.views.webdevBasic);
	app.get('/ios-development-bootcamp', routes.views.iosdev);
	app.get('/data-science-bootcamp', routes.views.dataScience);
	app.get('/powerbi', routes.views.bootcamp.powerBI);
	app.get('/uidesign', routes.views.bootcamp.uiDesign);
	app.get('/internship', routes.views.career.internshipProgram);
	app.get('/community', routes.views.community);
	app.get('/offer-board', routes.views.testimonial.offerBoard);
	app.get('/tutorials', routes.views.tutorials);
	app.get('/tutorials/:slug', routes.views.service);

	// Open-courses Path
	app.get('/open-lecture', routes.views.openLecture);

	// Location
	app.get('/city', routes.views.city);
	app.get('/city/:slug', routes.views.city);
	app.get('/blog', routes.views.blog);
	app.get('/blog/:slug', routes.views.post);
	app.get('/meetups', routes.views.meetups);
	app.get('/application', routes.views.application);
	app.get('/workshop/:key', routes.views.workShopDetail);
	app.get('/workshop-application', routes.views.workShopApplication);
	app.get('/job', routes.views.job);
	app.get('/job/:key', routes.views.jobdetail);
	app.get('/eventApplication', routes.views.eventApplication);
	app.get('/eventApplication/:key', routes.views.eventApplication);
	app.get('/sitemap.xml', function (req, res) {
		sitemap.create(keystone, req, res, {
			ignore: ['^\/api.*$']
		});
	});
	app.get('/robots.txt', function (req, res) {
		res.sendFile('public/robots.txt', { root: __dirname });
	});

	//user middleware.verifyAuth to verify user information and store in req.user

	// API
	app.all('/api*', keystone.middleware.api);

	//keystone project log in system, should verify and consider delete it
	app.all('/api/app/signup-email', routes.api.app['signup-email']);
	app.all('/api/app/signin-email', routes.api.app['signin-email']);

	//authentication
	app.post('/api/authentication/signIn', routes.api.authentication.signIn);

	// User
	app.post('/api/users', routes.api.user.signUp, routes.api.mailer.sendVerification);
	app.get('/api/users/me', middleware.verifyAuth, routes.api.user.getCurrentUser);
	app.patch('/api/users/me', middleware.verifyAuth, routes.api.user.updateCurrentUser);
	app.post('/api/users/me/password', middleware.verifyAuth, routes.api.user.updatePassword);

	//update with token only
	app.post('/api/users/email-verification', routes.api.user.verifyEmail);
	app.post('/api/users/password-reset', routes.api.user.resetPassword);

	//mailer
	app.post('/api/mailer/email-verification', routes.api.mailer.sendVerification);
	app.post('/api/mailer/password-reset', routes.api.mailer.sendForgetPassword);

	//feedback
	app.get('/api/feedback', routes.api.feedback.get);
	app.all('/api/feedback/create', routes.api.feedback.create);

	//teacher
	app.get('/api/teacher/get', routes.api.teacher.get);
	app.get('/api/teacher', routes.api.teacher.list);
	app.get('/api/teachers/service/:slug', routes.api.teacher.getTeachersByServiceSlug);

	//enrollment
	app.get('/api/enrollment', routes.api.enrollment.list);
	app.get('/api/enrollment/:id', routes.api.enrollment.get);
	app.put('/api/enrollment/:id', routes.api.enrollment.update);
	app.post('/api/enrollment', routes.api.enrollment.create);
	app.get('/api/meetupEnrollment/:id', routes.api.meetupEnrollment.get);
	app.put('/api/meetupEnrollment/:id', routes.api.meetupEnrollment.update);
	app.post('/api/meetupEnrollment', routes.api.meetupEnrollment.create);

	//student
	app.get('/api/student/get', routes.api.student.get);

	//tutor
	app.get('/api/tutor', routes.api.tutor.list);
	app.get('/api/tutor/:id', routes.api.tutor.get);

	//workshop
	app.get('/api/workshops', routes.api.workshop.list);
	app.get('/api/workshops/:key', routes.api.workshop.get);

	//stripe charge
	app.post('/api/stripeCharges', routes.api.stripeCharge.create);

	//order
	app.post('/api/orders', routes.api.order.create);
	app.get('/api/orders/get', routes.api.order.list);
	app.get('/api/orders/:id', routes.api.order.get);
	app.put('/api/orders/:id', routes.api.order.update);

	//post
	app.post('/api/post', routes.api.post.create);
	app.get('/api/post', routes.api.post.list);
	app.get('/api/posts/:slug', routes.api.post.getPostBySlug);
	app.get('/api/posts', routes.api.post.getPostsByPage);

	//resource module
	app.post('/api/resource-request', routes.api.resourceRequest.create);
	app.put('/api/resource/:id', routes.api.resource.update);
	app.get('/api/resource/:id', routes.api.resource.get);

	//course
	app.get('/api/course', routes.api.course.list);
	app.get('/api/course/listCourse', routes.api.course.listCourseShort);
	app.get('/api/course/listCourseWithUni', routes.api.course.listCourseWithUni);
	app.get('/api/course/university/:uniId', routes.api.course.getCourseByUni);
	app.get('/api/course/:id', routes.api.course.get);

	//training
	app.all('/api/training', routes.api.training.list);
	app.all('/api/training/short', routes.api.training.listTrainingShort);
	app.get('/api/training/:id', routes.api.training.get);

	//program
	app.all('/api/programs', routes.api.programs.list);

	//job
	app.get('/api/jobs', routes.api.job.list);

	//service
	app.get('/api/services', routes.api.service.list);
	app.get('/api/services/:id/tutors', routes.api.tutor.getTutorByService);
	app.get('/api/services/:id', routes.api.service.get);

	//techstack
	app.get('/api/technology-stack', routes.api.technologyStack.list);

	//careerPath
	app.get('/api/career-paths', routes.api.careerPaths.list);

	// General Query
	app.get('/api/university', routes.api.university.list);
	app.get('/api/university/:id', routes.api.university.get);
	app.get('/api/cities/:cityId/university', routes.api.university.getListByCityId);
	app.get('/api/cities/:cityId/services', routes.api.service.getServicesByCityId);
	app.get('/api/cities', routes.api.city.list);

	//Upload Image
	app.post('/api/uploadImage', routes.api.upload.uploadImage);

	//Explicitly define which lists we want exposed
	restful.expose({
		Enrollment: true,
		Feedback: true,
		Post: true,
		PostCategory: true,
		User: true
	}).start();
};
