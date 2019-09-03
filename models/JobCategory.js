const keystone = require('keystone');

/**
 * JobCategory Model
 * ==================
 */

const JobCategory = new keystone.List('JobCategory', {
	autokey: { from: 'name', path: 'key', unique: true }
});

JobCategory.add({
	name: { type: String, required: true }
});

JobCategory.relationship({ ref: 'Post', refPath: 'categories' });

JobCategory.register();
