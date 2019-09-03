const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * Career Path Model
 * =============
 */

const CareerPath = new keystone.List('CareerPath', {
	autokey: { from: 'name', path: 'slug', unique: true }
});

CareerPath.add({
	name: { type: String, required: true },
	chName: { type: String },
	icon: { type: Types.CloudinaryImage, note:'Small Size, 100w*100h png' },
	trainings: { type: Types.Relationship, ref: 'Training', many: true }
});

CareerPath.register();
