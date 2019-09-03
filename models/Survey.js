const keystone = require('keystone');

/**
 * Course Model
 * =============
 */

const Survey = new keystone.List('Survey', {
	autokey: { from: 'name', path: 'slug', unique: true }
});

Survey.add({
	meta: {
		title: { type: String },
		description: { type: String }
	},
	name: { type: String, required: true },
	category: { type: String },
	question: { type: String },
	options: { type: String },
	priority: { type: String }
});

Survey.register();
