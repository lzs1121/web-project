const keystone = require('keystone');

/**
 * Feedback Model
 * =============
 */

const feedback = new keystone.List('Feedback', {
	autokey: { from: 'name', path: 'key', unique: true }
});

feedback.add({
	name: { type: String, required: true },
	email: { type: String },
	description: { type: String }
});

feedback.register();
