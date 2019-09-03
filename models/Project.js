const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * Project Model
 * =============
 */

const Project = new keystone.List('Project', {
	autokey: { from: 'name', path: 'slug', unique: true }
});

Project.add({
	meta: {
		title: { type: String },
		description: { type: String }
	},
	name: { type: String, required: true },
	title: { type: String },
	url: { type: String },
	city: { type: Types.Relationship, ref: 'City', many: true },
	thumbnail: { type: Types.CloudinaryImage },
	thumbNailAlt: { type: String },
	shortDescription: { type: Types.Html, wysiwyg: true, height: 400 },
	teamDescrition: { type: String },
	teacher: { type: Types.Relationship, ref: 'Teacher', many: true },
	skills:{ type: Types.TextArray, label:'Skills' },
	category: { type: Types.Relationship, ref: 'PostCategory', many: true }
});

Project.register();
