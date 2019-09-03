const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * Showcase Model
 * =============
 */

const Showcase = new keystone.List('Showcase', {
	autokey: { from: 'name', path: 'slug', unique: true, sortable: true }
});

Showcase.add({
	name: { type: String, required: true },
	avatar: { type: Types.CloudinaryImage },
	image: { type: Types.CloudinaryImage },
	studentName: { type: Types.Relationship, ref: 'Student', many: true },
	location: { type: Types.Select, options: 'Sydney, Brisbane, Melbourne, Seatle, China', default: 'Sydney' },
	training: { type: Types.Relationship, ref: 'Training', many: true },
	projectUrl: { type: Types.Url },
	graduateDate: { type: Types.Date },
	university: { type: Types.Relationship, ref: 'University', required: true, initial: true },
	stack: { type: String },
	description: { type: Types.Html, wysiwyg: true, height: 150 }
});

Showcase.register();
