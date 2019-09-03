const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * Post Model
 * ==========
 */

const Post = new keystone.List('Post', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	defaultSort: '-publishedAt',
	drilldown: 'categories'
});

Post.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	createdAt: { type: Date, default: Date.now },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	isAuthor: { type: Boolean, default: true },
	author: { type: Types.Relationship, ref: 'User', note:'选择author，teacher或tutor', dependsOn: { isAuthor: true }, filters: { role: 'staff' } },
	isTeacher: { type: Boolean },
	teacher: { type: Types.Relationship, ref: 'Teacher', index: true, note:'选择author，teacher或tutor', dependsOn: { isTeacher: true } },
	isTutor: { type: Boolean },
	tutor: { type: Types.Relationship, ref: 'Tutor', index: true, note:'选择author，teacher或tutor', dependsOn: { isTutor: true } }
}, 'SEO For Google(Required)', {
	meta: {
		title: { type: String, initial: true },
		keywords: { type: String, initial: true, note:'用英文 逗号 隔开' },
		description: {
			type: Types.Textarea,
			note: '必须最少40个字，最多90个字 For SEO',
			initial: true,
			label:'Meta Description'
		}
	}
}, 'Blog Content', {
	image:
	{
		type: Types.CloudinaryImage,
		note: 'Width:900px, height:500px',
		autoCleanup : true, select : true
	},
	imageAlt:
	{
		type: String,
		note: 'For SEO（Required）'
	},
	content: {
		brief:  { type: Types.Textarea, label:'摘要' },
		extended: { type: Types.Html, wysiwyg: true, height: 800, label:'正文' }
	},
	createdAt: { type: Date, default: Date.now }
}, 'Choose Categories', {
	university: { type: Types.Relationship, ref: 'University', many: true },
	course: { type: Types.Relationship, ref: 'Course', many: true },
	training: { type: Types.Relationship, ref: 'Training', many: true },
	service: { type: Types.Relationship, ref: 'Service', many: true },
	categories: { type: Types.Relationship, ref: 'PostCategory', many: true },
	city: { type: Types.Relationship, ref: 'City', many: true }
}, 'Extended Infomation (Optional)', {
	postBackgroundImage: { type: Types.CloudinaryImage, autoCleanup : true, select : true }
});

Post.schema.virtual('content.full').get(function () {
	return this.content.extended || this.content.brief;
});

Post.defaultSort = '-createdAt';
Post.defaultColumns = 'title, state|20%, author|20%, createdAt|20%, publishedDate |20%';
Post.register();
