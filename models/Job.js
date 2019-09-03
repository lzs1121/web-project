const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * Job Model
 * ==========
 */

const Job = new keystone.List('Job', {
	map: { name: 'title' },
	autokey: { path: 'key', from: 'title', unique: true }
});

Job.add({
	meta: {
		title: { type: String },
		keywords: { type: String },
		description: {
			type: String,
			note: 'For SEO'
		}
	},

	title: { type: String, initial: true, required: true, max: 55 },
	company: { type: Types.Relationship, ref: 'Company' },
	city: { type: Types.Relationship, ref: 'City' },
	salary: { type: String, default: 'competitive' },
	jobType: { type: Types.Select, options: 'Intern, Part-time, Full-time, Contract', default: 'Full-time' },
	level: { type: Types.Select, options: 'Intern, Junior, Mid-Level, Senior, Tech-lead', default: 'Junior' },
	state: { type: Types.Select, options: 'draft, published', default: 'draft', index: true },
	status: { type: Types.Select, options: 'Open, Close', default: 'Open' },
	author: { type: Types.Relationship, ref: 'User', index: true },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	briefDescription: { type: String, default: '匠人精选IT工作岗位', max: 120 },
	job: {
		company: { type: Types.Html, wysiwyg: true, height: 150 },
		description: { type: Types.Html, wysiwyg: true, height: 150 },
		requirement: { type: Types.Html, wysiwyg: true, height: 400 }
	},
	categories: { type: Types.Relationship, ref: 'JobCategory', many: true },
	apply: { type: String, default: 'career@jiangren.com.au' },
	isFeatured: { type: Boolean, default: true }
});

Job.schema.virtual('content.full').get(function () {
	return this.content.description || this.content.requirement;
});

Job.schema.virtual('url').get(() => {
	return '/jobs/' + this.key;
});

Job.defaultSort = '-publishedDate';
Job.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Job.register();
