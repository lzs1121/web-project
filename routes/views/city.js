const keystone = require('keystone');
const training = keystone.list('Training');
const teachers = keystone.list('Teacher');
const tutors = keystone.list('Tutor');
const cities = keystone.list('City');
const meetups = keystone.list('Meetup');
const posts = keystone.list('Post');
const universities = keystone.list('University');
const programs = keystone.list('Program');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;
	locals.workshops = [];

	Object.assign(locals, {
		title:'',
		section:'',
		reviews: [],
		teachers: [],
		tutors: [],
		courses: [],
		filters: {
			city: req.params.slug || 'brisbane'
		},
		cityName:'',
		cityBackground:{
			url:'',
			secure_url: ''
		},
		slogan:'',
		officeAddress:'',
		metaDescription:'',
		description:'',
		services:[],
		resources:[],
		programs:[],
		workshops:[]
	});

	// locals.section is used to set the currently selected
	// item in the header navigation.
	view.query('upcomingMeetups',
		meetups.model.find()
			.where('state', 'active')
			.sort('-startDate')
	);
	view.on('init', function (next) {
		cities.model.find()
			.sort('-publishedAt')
			.where('slug', locals.filters.city)
			.exec(function(err, city) {
				if (err) res.err(err);
				locals.city = city[0];
				locals.cityId = locals.city._id;
				locals.title = `${locals.city.meta.title}`;
				locals.cityName = locals.city.name;
				locals.metaTitle = `${locals.city.meta.title}`;
				locals.metaDescription = `${locals.city.meta.description}`;
				locals.chName = locals.city.chName;
				locals.officeAddress = locals.city.officeAddress;
				locals.description = locals.city.description;
				locals.cityBackground = locals.city.cityBackground;
				locals.slogan = locals.city.slogan;
				next();
			});
	});
	view.on('init', function (next) {
		meetups.model.find()
			.where('state', 'past')
			.where('city')
			.in([locals.cityId])
			.sort('-startDate')
			.exec(function(err, pastMeetups) {
				if (err) res.err(err);
				locals.pastMeetups = pastMeetups;
				next();
			});
	});
	view.on('init', function (next) {
		teachers.model.find()
			.sort('-priority')
			.populate('careerPath preCompany university')
			.where('city')
			.in([locals.cityId])
			.exec(function(err, teachers) {
				if (err) res.err(err);
				locals.teachers = teachers;
				next();
			});
	});
	view.on('init', function (next) {
		locals.workshops = locals.workshopsList.filter(workshop => {
			return workshop.city.toString() === locals.cityId.toString();
		});
		next();
	});
	view.on('init', function (next) {
		tutors.model.find()
			.sort('-priority')
			.where('city', locals.cityId)
			.exec(function(err, tutors) {
				if (err) res.err(err);
				locals.tutors = tutors;
				next();
			});
	});
	view.on('init', function (next) {
		training.model.find()
			.sort('-priority').populate('teachers', 'name').populate('city', 'name')
			.where('city')
			.in([locals.cityId])
			.exec(function(err, trainings) {
				if (err) res.err(err);
				locals.courses = trainings;
				next();
			});
	});
	view.on('init', function (next) {
		universities.model.find()
			.where('featured', true)
			.where('city', locals.cityId)
			.populate('resource')
			.exec(function(err, universities) {
				if (err) res.err(err);
				locals.universities = universities;
				locals.resources = [].concat.apply([], locals.universities.map(item => item.resource));
				next();
			});
	});

	view.on('init', function (next) {
		programs.model.find()
			.where('city', locals.cityId)
			.sort('commenceCourseDate')
			.populate('city training')
			.exec(function(err, programs) {
				if (err) res.err(err);
				locals.programs = programs.filter(program => {
					return program.commenceCourseDate > Date.now();
				});
				next();
			});
	});

	view.on('init', function (next) {
		const post = posts
			.paginate({
				page: req.query.page || 1,
				perPage: 10,
				maxPages: 1,
				filters: {
					state: 'published'
				}
			}).sort('-publishedDate').populate('author categories').limit(10);

		post.exec(function (err, results) {
			locals.posts = results;
			next(err);
		});
	});

	// Render the view
	view.render('city');
};
