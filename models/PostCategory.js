const keystone = require('keystone');
const Types = keystone.Field.Types;
/**
 * PostCategory Model
 * ==================
 */

const PostCategory = new keystone.List('PostCategory', {
	autokey: { from: 'name', path: 'key', unique: true }
});

PostCategory.add({
	name: { type: String, required: true },
	icon: { type: Types.CloudinaryImage }
});

PostCategory.relationship({ ref: 'Post', refPath: 'categories' });

PostCategory.register();
